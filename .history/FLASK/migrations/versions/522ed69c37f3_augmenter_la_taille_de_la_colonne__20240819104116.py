"""Augmenter la taille de la colonne password_hash

Revision ID: 522ed69c37f3
Revises: fe1f4ee58482
Create Date: 2024-08-19 10:38:46.534872
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '522ed69c37f3'
down_revision = 'fe1f4ee58482'
branch_labels = None
depends_on = None


def upgrade():
    # Modifier la taille de la colonne password_hash
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column(
            'password_hash',
            existing_type=sa.String(length=150),
            type_=sa.String(length=255),
            existing_nullable=False
        )


def downgrade():
    # Revenir à l'état antérieur
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column(
            'password_hash',
            existing_type=sa.String(length=255),
            type_=sa.String(length=150),
            existing_nullable=False
        )
