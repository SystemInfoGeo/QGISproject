"""Ajout de la colonne created_at à la table user

Revision ID: 358c354b591f
Revises: 43a85e1bafc3
Create Date: 2024-09-13 12:47:41.201312

"""
from alembic import op
import sqlalchemy as sa


# Identifiants de la révision
revision = '358c354b591f'
down_revision = '43a85e1bafc3'
branch_labels = None
depends_on = None


def upgrade():
    # Vérifier si la colonne 'is_responded' existe déjà avant de l'ajouter
    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='message' AND column_name='is_responded'
        ) THEN
            ALTER TABLE message ADD COLUMN is_responded BOOLEAN;
        END IF;
    END $$;
    """)


def downgrade():
    with op.batch_alter_table('message', schema=None) as batch_op:
        batch_op.drop_column('is_responded')
