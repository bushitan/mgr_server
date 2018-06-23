# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lite', '0030_auto_20180423_1121'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='app',
            name='sys_user',
        ),
    ]
