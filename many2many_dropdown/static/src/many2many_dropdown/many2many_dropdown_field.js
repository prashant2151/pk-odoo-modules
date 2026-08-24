/** @odoo-module **/
import { onWillUnmount, useState } from "@odoo/owl";
import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { Domain } from "@web/core/domain";
import { useBus } from "@web/core/utils/hooks";
import { debounce } from "@web/core/utils/timing";
import {
    Many2ManyTagsField,
    many2ManyTagsField,
} from "@web/views/fields/many2many_tags/many2many_tags_field";
import { Many2XMultiSelectAutocomplete } from "./many2x_multi_select_autocomplete";

export class Many2ManyDropdownField extends Many2ManyTagsField {
    static template = "many2many_dropdown.Many2ManyDropdownField";
    static components = {
        ...Many2ManyTagsField.components,
        Many2XAutocomplete: Many2XMultiSelectAutocomplete,
    };

    setup() {
        super.setup();
        this.idsToAdd = new Set();
        this.idsToRemove = new Set();
        this.selectionState = useState({ rev: 0 });
        this.debouncedCommitChanges = debounce(this.commitChanges.bind(this), 100);
        useBus(this.props.record.model.bus, "NEED_LOCAL_CHANGES", this.commitChanges.bind(this));
        onWillUnmount(this.commitChanges.bind(this));
    }

    getEffectiveIds() {
        const selected = new Set(this.props.record.data[this.props.name].currentIds);
        for (const resId of this.idsToAdd) {
            selected.add(resId);
        }
        for (const resId of this.idsToRemove) {
            selected.delete(resId);
        }
        return selected;
    }

    isSelected(resId) {
        this.selectionState.rev;
        return this.getEffectiveIds().has(resId);
    }

    onToggle(id, checked) {
        const list = this.props.record.data[this.props.name];
        return list.addAndRemove(checked ? { add: [id] } : { remove: [id] });
    }

    getDomain() {
        const domain =
            typeof this.props.domain === "function" ? this.props.domain() : this.props.domain;
        return domain || [];
    }

    getSearchMoreDomain() {
        const domain =
            typeof this.props.domain === "function" ? this.props.domain() : this.props.domain;
        const currentIds = this.props.record.data[this.props.name].currentIds.filter(
            (id) => typeof id === "number"
        );
        return Domain.and([domain || [], Domain.not([["id", "in", currentIds]])]).toList(
            this.props.context
        );
    }

    commitChanges() {
        if (this.idsToAdd.size === 0 && this.idsToRemove.size === 0) {
            return;
        }
        const result = this.props.record.data[this.props.name].addAndRemove({
            add: [...this.idsToAdd],
            remove: [...this.idsToRemove],
        });
        this.idsToAdd.clear();
        this.idsToRemove.clear();
        this.selectionState.rev++;
        return result;
    }
}

export const many2ManyDropdownField = {
    ...many2ManyTagsField,
    component: Many2ManyDropdownField,
    displayName: _t("Multi Select Tags"),
};

registry.category("fields").add("many2many_dropdown", many2ManyDropdownField);
