"""Add email column to User table

Revision ID: b79b5e991bd3
Revises: None
Create Date: 2024-08-18 16:01:03.202283

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

# revision identifiers, used by Alembic.
revision = 'b79b5e991bd3'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Vérifiez si la colonne email existe déjà
    conn = op.get_bind()
    inspector = inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('user')]

    with op.batch_alter_table('user', schema=None) as batch_op:
        if 'email' not in columns:
            batch_op.add_column(sa.Column('email', sa.String(length=150), nullable=False))
        # Vérifiez si la contrainte 'user_username_key' existe avant de la supprimer
        constraints = [con['name'] for con in inspector.get_unique_constraints('user')]
        if 'user_username_key' in constraints:
            batch_op.drop_constraint('user_username_key', type_='unique')
        batch_op.create_unique_constraint(None, ['email'])
        if 'username' in columns:
            batch_op.drop_column('username')


def downgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.VARCHAR(length=150), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='unique')
        batch_op.create_unique_constraint('user_username_key', ['username'])
        batch_op.drop_column('email')
