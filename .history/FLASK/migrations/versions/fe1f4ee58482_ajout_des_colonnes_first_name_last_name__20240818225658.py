"""Ajout des colonnes first_name, last_name, phone_number à la table user

Revision ID: fe1f4ee58482
Revises: b79b5e991bd3
Create Date: 2024-08-18 22:49:45.391652
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fe1f4ee58482'
down_revision = 'b79b5e991bd3'
branch_labels = None
depends_on = None


def upgrade():
    # Ajouter les colonnes sans la contrainte NOT NULL
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('first_name', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('last_name', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('phone_number', sa.String(length=20), nullable=True))

    # Mettre à jour les valeurs existantes pour les colonnes nouvellement ajoutées
    op.execute("UPDATE user SET first_name = 'default_first_name', last_name = 'default_last_name', phone_number = 'default_phone_number' WHERE first_name IS NULL")

    # Modifier les colonnes pour les rendre NOT NULL
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('first_name', existing_type=sa.String(length=100), nullable=False)
        batch_op.alter_column('last_name', existing_type=sa.String(length=100), nullable=False)
        batch_op.alter_column('phone_number', existing_type=sa.String(length=20), nullable=False)

def downgrade():
    # Revenir à l'état antérieur
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('phone_number')
        batch_op.drop_column('last_name')
        batch_op.drop_column('first_name')
