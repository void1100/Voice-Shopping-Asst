from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db, User, ShoppingListItem
from schemas import (
    ListItemCreate, ListItemUpdate, ListItemResponse,
    BatchListItemCreate, SuccessResponse,
)
from auth import get_current_user
from products import fuzzy_match_item, categorize_item

router = APIRouter(prefix="/list", tags=["list"])


def _get_user_item(db: Session, user_id: int, item_id: int) -> ShoppingListItem:
    item = db.query(ShoppingListItem).filter(
        ShoppingListItem.id == item_id,
        ShoppingListItem.user_id == user_id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.get("", response_model=list[ListItemResponse])
def get_my_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = db.query(ShoppingListItem).filter(
        ShoppingListItem.user_id == current_user.id
    ).order_by(ShoppingListItem.created_at.desc()).all()
    return items


@router.post("", response_model=ListItemResponse, status_code=201)
def add_to_list(
    payload: ListItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    canonical = fuzzy_match_item(payload.name)
    category = payload.category or categorize_item(canonical)

    # Merge if same canonical item already exists for this user
    existing = db.query(ShoppingListItem).filter(
        ShoppingListItem.user_id == current_user.id,
        ShoppingListItem.normalized_name == canonical,
    ).first()

    if existing:
        existing.quantity += payload.quantity
        db.commit()
        db.refresh(existing)
        return existing

    item = ShoppingListItem(
        user_id=current_user.id,
        name=payload.name,
        normalized_name=canonical,
        category=category,
        quantity=payload.quantity,
        price=payload.price,
        note=payload.note or "",
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=ListItemResponse)
def update_list_item(
    item_id: int,
    payload: ListItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = _get_user_item(db, current_user.id, item_id)

    if payload.name is not None:
        item.name = payload.name
        item.normalized_name = fuzzy_match_item(payload.name)
    if payload.category is not None:
        item.category = payload.category
    if payload.quantity is not None:
        item.quantity = payload.quantity
    if payload.price is not None:
        item.price = payload.price
    if payload.note is not None:
        item.note = payload.note

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", response_model=ListItemResponse)
def delete_list_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = _get_user_item(db, current_user.id, item_id)
    db.delete(item)
    db.commit()
    return item


@router.delete("", response_model=SuccessResponse)
def clear_my_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(ShoppingListItem).filter(
        ShoppingListItem.user_id == current_user.id
    ).delete()
    db.commit()
    return SuccessResponse(success=True, message="List cleared")


@router.post("/batch", response_model=list[ListItemResponse], status_code=201)
def add_items_batch(
    payload: BatchListItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    added = []
    for entry in payload.items:
        canonical = fuzzy_match_item(entry.name)
        category = entry.category or categorize_item(canonical)

        existing = db.query(ShoppingListItem).filter(
            ShoppingListItem.user_id == current_user.id,
            ShoppingListItem.normalized_name == canonical,
        ).first()

        if existing:
            existing.quantity += entry.quantity
            db.commit()
            db.refresh(existing)
            added.append(existing)
        else:
            item = ShoppingListItem(
                user_id=current_user.id,
                name=entry.name,
                normalized_name=canonical,
                category=category,
                quantity=entry.quantity,
                price=entry.price,
                note=entry.note or "",
            )
            db.add(item)
            db.commit()
            db.refresh(item)
            added.append(item)

    return added
