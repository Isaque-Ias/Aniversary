import os
from flask import render_template, redirect, url_for, request, flash
from app import app, db
import sqlalchemy as sa
from config import basedir
from app.forms import AniversarioForm
from app.models import Aniversario
from datetime import datetime

@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html")

@app.route("/cadastro", methods=["GET", "POST"])
def cadastro():
    form = AniversarioForm()

    model = db.session.scalars(sa.select(Aniversario)).all()
    
    if form.validate_on_submit():
        if form.person_exists():
            flash("O aniversariante já existe nos dados.")
            return redirect(url_for("cadastro"))

        aniversario = Aniversario(person=form.person.data, datetime=datetime.strptime(form.datetime.data, "%d/%m/%Y"))
        db.session.add(aniversario)
        db.session.commit()

        return redirect(url_for("cadastro"))

    return render_template("cadastro.html", model=model, form=form)

@app.route("/cadastro/delete/<id>")
def delete_aniversario(id):
    aniversario = db.session.get(Aniversario, id)

    db.session.delete(aniversario)
    db.session.commit()

    return redirect(url_for("cadastro"))

@app.route("/cadastro/edit/<id>", methods=["GET", "POST"])
def edit_aniversario(id):
    form = AniversarioForm()

    model = db.session.scalars(sa.select(Aniversario)).all()
    aniversario = db.session.get(Aniversario, id)

    if form.validate_on_submit():
        if form.person_exists():
            flash("O aniversariante já existe nos dados.")
            return redirect(url_for("cadastro"))
            
        aniversario.person = form.person.data
        aniversario.datetime = datetime.strptime(form.datetime.data, "%Y-%m-%d %H:%M:%S")
        db.session.commit()

        return redirect(url_for("cadastro"))

    elif request.method == "GET":
        form.person.data = aniversario.person
        form.datetime.data = aniversario.datetime

    return render_template("cadastro.html", form=form, model=model)