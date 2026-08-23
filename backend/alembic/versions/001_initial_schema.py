"""initial items table

Revision ID: 001_initial
Revises: 
Create Date: 2026-08-23

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "items",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("name", sa.String(), unique=True, nullable=False),
        sa.Column("category", sa.String(), default="uncategorized"),
        sa.Column("quantity", sa.Integer(), default=1),
        sa.Column("price", sa.Float(), default=0),
        sa.Column("date", sa.DateTime(), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("items")
