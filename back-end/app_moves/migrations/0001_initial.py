# Generated by Django 5.0.4 on 2024-04-13 01:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('app_types', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Move',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('description', models.TextField()),
                ('power', models.IntegerField()),
                ('move_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='app_types.type')),
            ],
        ),
    ]
