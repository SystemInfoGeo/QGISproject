"""Add user_id to message

Revision ID: fff7cffeb2f1
Revises: 2d833103f409
Create Date: 2024-09-15 12:41:01.511855
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'fff7cffeb2f1'
down_revision = '2d833103f409'
branch_labels = None
depends_on = None

def upgrade():
    # Ajouter la colonne user_id comme nullable
    with op.batch_alter_table('message', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
    
    # Pas encore de contrainte de clé étrangère ici
    # La contrainte sera ajoutée dans une migration ultérieure

def downgrade():
    # Supprimer la colonne user_id
    with op.batch_alter_table('message', schema=None) as batch_op:
        batch_op.drop_column('user_id')
