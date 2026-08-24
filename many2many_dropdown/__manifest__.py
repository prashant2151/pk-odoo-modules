# -*- coding: utf-8 -*-
# Part of Many2many Dropdown. See LICENSE file for full copyright and licensing details.

{
    'name': 'Many2many Dropdown',
    'version': '17.0.1.0.1',
    'category': 'Tools',
    'summary': 'Multi-select many2many widget with dropdown checkboxes',
    'description': """
Many2many Dropdown Widget
=========================

Add a powerful many2many field widget that lets users select multiple records
at once from a searchable dropdown panel.

Key Features
------------
* Select multiple records in one dropdown session
* Standard Odoo create, create & edit, and search more actions
* Searchable dropdown with checkbox multi-selection
* Selected records displayed as standard tags
* Compatible with any many2many field in form and list views
* Supports no_create, no_quick_create, and no_create_edit options

Usage
-----
Add the widget to any many2many field in your XML views::

    <field name="partner_ids"
           widget="many2many_dropdown"
           placeholder="Select partners..."/>
    """,
    'author': 'author',
    'license': 'LGPL-3',
    'depends': ['web'],
    'data': [],
    'demo': [],
    'assets': {
        'web.assets_backend': [
            'many2many_dropdown/static/src/many2many_dropdown/**/*',
        ],
    },
    'images': [
        'static/description/main_screenshot.png',
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}
