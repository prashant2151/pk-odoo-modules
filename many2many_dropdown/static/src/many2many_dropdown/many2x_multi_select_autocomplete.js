/** @odoo-module **/
import { _t } from "@web/core/l10n/translation";
import { Many2XAutocomplete } from "@web/views/fields/relational_utils";
import { MultiSelectAutoComplete } from "./multi_select_autocomplete";

export class Many2XMultiSelectAutocomplete extends Many2XAutocomplete {
    static template = "many2many_dropdown.Many2XMultiSelectAutocomplete";
    static components = { AutoComplete: MultiSelectAutoComplete };
    static props = {
        ...Many2XAutocomplete.props,
        isSelected: Function,
        onToggle: Function,
        getSearchMoreDomain: { type: Function, optional: true },
    };

    get optionsSource() {
        return {
            ...super.optionsSource,
            optionTemplate: "many2many_dropdown.MultiSelectAutoCompleteOption",
        };
    }

    async loadOptionsSource(request) {
        const options = await super.loadOptionsSource(request);
        return options.map((option) => {
            if (option.value !== undefined && !option.action && !option.unselectable) {
                return { ...option, isRecord: true };
            }
            return option;
        });
    }

    async onSearchMore(request) {
        const { resModel, context, fieldString } = this.props;
        const domain = this.props.getSearchMoreDomain
            ? this.props.getSearchMoreDomain()
            : this.props.getDomain();
        let dynamicFilters = [];
        if (request.length) {
            const nameGets = await this.orm.call(resModel, "name_search", [], {
                name: request,
                args: domain,
                operator: "ilike",
                limit: this.props.searchMoreLimit,
                context,
            });
            dynamicFilters = [
                {
                    description: _t("Quick search: %s", request),
                    domain: [["id", "in", nameGets.map((nameGet) => nameGet[0])]],
                },
            ];
        }
        const title = _t("Search: %s", fieldString);
        this.selectCreate({
            domain,
            context,
            filters: dynamicFilters,
            title,
        });
    }
}

