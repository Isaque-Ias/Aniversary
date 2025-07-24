from app import db
import sqlalchemy as sa
import sqlalchemy.orm as so
from typing import Optional
from datetime import datetime

class Aniversario(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    person: so.Mapped[str] = so.mapped_column(sa.String(64))
    datetime: so.Mapped[str] = so.mapped_column(sa.DateTime(32))

    def __repr__(self):
        return 'Aniversário<{}>'.format(self.datetime)