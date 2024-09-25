"""Merge heads 0741e411f02b and 3fa2d6ff37f8

Revision ID: 82b3cd268f69
Revises: 0741e411f02b, 3fa2d6ff37f8
Create Date: 2024-09-15 18:46:30.441393

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '82b3cd268f69'
down_revision = ('0741e411f02b', '3fa2d6ff37f8')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
