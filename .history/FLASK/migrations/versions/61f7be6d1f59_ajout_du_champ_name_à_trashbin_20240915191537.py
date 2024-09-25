"""Ajout du champ name à TrashBin

Revision ID: 61f7be6d1f59
Revises: 358c354b591f
Create Date: 2024-09-13 23:07:35.077308

"""
from alembic import op
import sqlalchemy as sa


# Identifiants de la révision
revision = '61f7be6d1f59'
down_revision = '358c354b591f'
branch_labels = None
depends_on = None


def upgrade():
    # Vérifier si la colonne 'name' existe déjà avant de l'ajouter
    op.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name='trash_bins' AND column_name='name'
        ) THEN
            ALTER TABLE trash_bins ADD COLUMN name VARCHAR(100) NOT NULL;
        END IF;
    END $$;
    """)


def downgrade():
    with op.batch_alter_table('trash_bins', schema=None) as batch_op:
        batch_op.drop_column('name')
