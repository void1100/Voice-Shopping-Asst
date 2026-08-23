from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db, User, CartItem, ShoppingListItem
from schemas import (
    CartItemCreate, CartItemUpdate, CartItemResponse,
    BatchCartItemCreate, SuccessResponse,
)
from auth import get_current_user
from products import fuzzy_match_item, categorize_item

router = APIRouter(prefix="/cart", tags=["cart"])


def _get_user_cart_item(db: Session, user_id: int, item_id: int) -> CartItem:
    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == user_id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return item


@router.get("", response_model=list[CartItemResponse])
def get_my_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = db.query(CartItem).filter(
        CartItem.user_id == current_user.id
    ).order_by(CartItem.created_at.desc()).all()
    return items


@router.post("", response_model=CartItemResponse, status_code=201)
def add_to_cart(
    payload: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    canonical = fuzzy_match_item(payload.name)
    category = payload.category or categorize_item(canonical)

    # Merge if same canonical item already in this user's cart
    existing = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.normalized_name == canonical,
    ).first()

    if existing:
        existing.quantity += payload.quantity
        db.commit()
        db.refresh(existing)
        return existing

    item = CartItem(
        user_id=current_user.id,
        name=payload.name,
        normalized_name=canonical,
        category=category,
        quantity=payload.quantity,
        price=payload.price,
        source_list_item_id=payload.source_list_item_id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    item_id: int,
    payload: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = _get_user_cart_item(db, current_user.id, item_id)

    if payload.quantity is not None:
        item.quantity = payload.quantity
    if payload.price is not None:
        item.price = payload.price

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", response_model=CartItemResponse)
def delete_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = _get_user_cart_item(db, current_user.id, item_id)
    db.delete(item)
    db.commit()
    return item


@router.delete("", response_model=SuccessResponse)
def clear_my_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(CartItem).filter(
        CartItem.user_id == current_user.id
    ).delete()
    db.commit()
    return SuccessResponse(success=True, message="Cart cleared")


@router.post("/from-list/{list_item_id}", response_model=CartItemResponse)
def copy_list_item_to_cart(
    list_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Copy a shopping list item into the cart (keeps the list item)."""
    list_item = db.query(ShoppingListItem).filter(
        ShoppingListItem.id == list_item_id,
        ShoppingListItem.user_id == current_user.id,
    ).first()
    if not list_item:
        raise HTTPException(status_code=404, detail="List item not found")

    # Check if already in cart
    existing = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.normalized_name == list_item.normalized_name,
    ).first()

    if existing:
        existing.quantity += list_item.quantity
        db.commit()
        db.refresh(existing)
        return existing

    cart_item = CartItem(
        user_id=current_user.id,
        name=list_item.name,
        normalized_name=list_item.normalized_name,
        category=list_item.category,
        quantity=list_item.quantity,
        price=list_item.price,
        source_list_item_id=list_item.id,
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item
