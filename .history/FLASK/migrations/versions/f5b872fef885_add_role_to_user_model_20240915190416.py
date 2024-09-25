"""Add role to User model

Revision ID: f5b872fef885
Revises: fe1f4ee58482
Create Date: 2024-08-18 22:49:45.391652
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = 'f5b872fef885'
down_revision = 'fe1f4ee58482'
branch_labels = None
depends_on = None

def upgrade():
    # Inspecter la table pour vérifier si la colonne 'role' existe
    conn = op.get_bind()
    inspector = inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('user')]

    with op.batch_alter_table('user', schema=None) as batch_op:
        if 'role' not in columns:
            batch_op.add_column(sa.Column('role', sa.String(length=20), nullable=False, server_default='agent'))

def downgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('role')
