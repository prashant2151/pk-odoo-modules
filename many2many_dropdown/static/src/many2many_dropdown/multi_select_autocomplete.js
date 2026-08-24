/** @odoo-module **/
import { AutoComplete } from "@web/core/autocomplete/autocomplete";

export class MultiSelectAutoComplete extends AutoComplete {
    static props = {
        ...AutoComplete.props,
        isSelected: Function,
        onToggle: Function,
    };

    selectOption(option, params = {}) {
        if (this.isRecordOption(option)) {
            this.props.onToggle(option.value, !this.props.isSelected(option.value));
            return;
        }
        super.selectOption(option, params);
    }

    isRecordOption(option) {
        return Boolean(option.isRecord) || (option.value !== undefined && !option.action && !option.unselectable);
    }
}
