"""Ajout du modèle Notification

Revision ID: 2d833103f409
Revises: 61f7be6d1f59
Create Date: 2024-09-15 12:06:05.439230

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2d833103f409'
down_revision = '61f7be6d1f59'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('notification',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('message', sa.String(length=255), nullable=False),
    sa.Column('is_read', sa.Boolean(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('notification')
    # ### end Alembic commands ###
