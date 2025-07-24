from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired
from app import db
import sqlalchemy as sa
from app.models import Aniversario

class AniversarioForm(FlaskForm):
    person = StringField("Nome", validators=[DataRequired()])
    datetime = StringField("Data", validators=[DataRequired()])
    submit = SubmitField("Enviar")

    def person_exists(self):
        return db.session.scalar(sa.select(Aniversario).where(Aniversario.person == self.person.data)) is not None
    # def validate_person(self, person):
    #     aniversario = db.session.scalar(sa.select(Aniversario).where(Aniversario.person == person.data))
    #     if aniversario is not None:
    #         raise ValidationError("O aniversariante já existe nos dados.")