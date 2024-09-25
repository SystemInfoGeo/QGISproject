"""Ajout des colonnes first_name, last_name, phone_number à la table user

Revision ID: fe1f4ee58482
Revises: b79b5e991bd3
Create Date: 2024-08-18 22:49:45.391652
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = 'fe1f4ee58482'
down_revision = 'b79b5e991bd3'
branch_labels = None
depends_on = None


def upgrade():
    # Inspecter la table pour vérifier les colonnes existantes
    conn = op.get_bind()
    inspector = inspect(conn)

    columns = [col['name'] for col in inspector.get_columns('user')]

    with op.batch_alter_table('user', schema=None) as batch_op:
        # Ajouter les colonnes uniquement si elles n'existent pas déjà
        if 'first_name' not in columns:
            batch_op.add_column(sa.Column('first_name', sa.String(length=100), nullable=True))
        if 'last_name' not in columns:
            batch_op.add_column(sa.Column('last_name', sa.String(length=100), nullable=True))
        if 'phone_number' not in columns:
            batch_op.add_column(sa.Column('phone_number', sa.String(length=20), nullable=True))

    # Mettre à jour les valeurs existantes pour les colonnes nouvellement ajoutées
    op.execute('UPDATE "user" SET first_name = \'default_first_name\', last_name = \'default_last_name\', phone_number = \'default_phone_number\' WHERE first_name IS NULL OR last_name IS NULL OR phone_number IS NULL')

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
