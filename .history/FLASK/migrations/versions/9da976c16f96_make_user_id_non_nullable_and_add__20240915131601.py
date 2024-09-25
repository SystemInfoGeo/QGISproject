"""Make user_id non-nullable and add foreign key constraint

Revision ID: 9da976c16f96
Revises: fff7cffeb2f1
Create Date: 2024-09-15 13:11:25.626617
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '9da976c16f96'
down_revision = 'fff7cffeb2f1'
branch_labels = None
depends_on = None

def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('message', schema=None) as batch_op:
        # Rendre la colonne user_id non nullable
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        # Ajouter la contrainte de clé étrangère avec un nom explicite
        batch_op.create_foreign_key('fk_message_user', 'user', ['user_id'], ['id'])
    # ### end Alembic commands ###

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('message', schema=None) as batch_op:
        # Supprimer la contrainte de clé étrangère avec un nom explicite
        batch_op.drop_constraint('fk_message_user', type_='foreignkey')
        # Rendre la colonne user_id nullable
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    # ### end Alembic commands ###
