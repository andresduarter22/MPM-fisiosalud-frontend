import { useTranslation } from "react-i18next";

function DatagridLocales() { 
    const [t] = useTranslation();

    const localizedTextsMap = {
        columnMenuUnsort: t("columnMenu_Unsort"),
        columnMenuSortAsc: t("columnMenu_SortAsc"),
        columnMenuSortDesc: t("columnMenu_SortDesc"),
        columnMenuFilter: t("columnMenu_Filter"),
        columnMenuHideColumn: t("columnMenu_HideColumn"),
        columnMenuShowColumns: t(("columnMenu_ShowColumns"))
    };
    return localizedTextsMap
}
const exports = { DatagridLocales }
export default exports;