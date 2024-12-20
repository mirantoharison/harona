import { Box, Typography, Button, Grid, MenuItem, TextField, IconButton } from "@mui/material";
import { Code, DataArray, TextFields, Transform, FormatQuote, LooksOne, DataObject, IndeterminateCheckBox, Search, Cancel } from "@mui/icons-material";
import { useParsed, useTranslation } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useEffect, useState, useCallback } from "react";
import { DeleteButton, SaveButton, RefreshButton, ListButton } from "@refinedev/mui";

import { AttributeField } from "./create";

interface SelectorData {
  selector: { _id: string, description?: string };
}

export const SelectorEdit = () => {
  const { translate } = useTranslation();

  const fieldName = ["name", "displayName", "selector", "description"];
  const attributeArray = [
    { text: translate("pages.selectors.tags.group"), key: "group" },
    { text: translate("pages.selectors.tags.array"), key: "array" },
    { text: translate("pages.selectors.tags.text"), key: "text" },
    { text: translate("pages.selectors.tags.html"), key: "html" },
    { text: translate("pages.selectors.tags.split"), key: "split" },
    { text: translate("pages.selectors.tags.attribute"), key: "attrText" },
    { text: translate("pages.selectors.tags.number"), key: "firstNumber" },
    { text: translate("pages.selectors.tags.json"), key: "json" }
  ]

  const [data, setData] = useState<SelectorData | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<{ required: string } | {}>({});
  const [selectedAttributes, setSelectedAttributes] = useState([{ key: "", value: "" }]);
  const [selectElements, setSelectElements] = useState([[...attributeArray]]);
  const { id } = useParsed();

  const {
    saveButtonProps,
    refineCore: { query, formLoading, onFinish },
    handleSubmit,
    register,
    trigger,
    setValue,
    unregister,
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "selectors",
      action: "edit",
      id: id
    }
  });

  const computeSelectElements = (key: string, selectedAttributes: { key: string, value: boolean | number | string }[]) => {
    const newAttributes = [];
    const selectedKeys = selectedAttributes.map(attr => attr.key);

    if (key === "text") {
      const filteredAttributes = attributeArray.filter(attr =>
        (["firstNumber", "split"].includes(attr.key)) ||
        ([...selectedKeys].includes("array") === false && attr.key === "array")
      );
      newAttributes.push(...filteredAttributes);
    } else if (key === "array") {
      const filteredAttributes = attributeArray.filter(attr =>
        (["firstNumber", "json", "html", "attrText"].includes(attr.key)) ||
        ([...selectedKeys].includes("text") === false && attr.key === "text")
      );
      newAttributes.push(...filteredAttributes);
    }

    return newAttributes;
  }

  const handleAttributeChange = useCallback(async (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value) {
      const updatedAttributes = [...selectedAttributes];
      updatedAttributes[index] = { key: event.target.value, value: "" };
      setSelectedGroup(updatedAttributes.map(attr => attr.key).includes("group") ? true : false);
      setSelectedAttributes(updatedAttributes.slice(0, index + 1));

      const updatedSelectElements = [...selectElements];
      const nextItem = index + 1;
      if (updatedSelectElements[nextItem]) {
        updatedSelectElements[nextItem] = computeSelectElements(event.target.value, updatedAttributes);
        setSelectElements(updatedSelectElements.slice(0, index + 1));
      }

      if (updatedAttributes.map(attr => attr.key).includes("group")) setValue("selector", "");

      const triggerPromises = [];
      for (const key of fieldName) {
        triggerPromises.push(trigger(key));
      }
      Promise.all(triggerPromises);
    }
  }, [selectedAttributes, selectElements]);
  const handleAddAttribute = () => {
    const lastAttribute = selectedAttributes[selectedAttributes.length - 1];

    if (lastAttribute.key !== "") {
      const newAttributes = computeSelectElements(lastAttribute.key, selectedAttributes);
      const newSelectElements = [...selectElements];
      newSelectElements.push(newAttributes);

      setSelectedAttributes([...selectedAttributes, { key: "", value: "" }]);
      setSelectElements([...newSelectElements]);
    }
  };
  const handleRemoveAttribute = (index: number) => {
    const updatedAttributes = selectedAttributes.filter((_, i) => i !== index);
    setSelectedAttributes(updatedAttributes);

    const updatedSelectElements = [...selectElements];
    const previousItem = index - 1;
    const nextItem = index + 1;
    if (updatedSelectElements[nextItem]) {
      updatedSelectElements[nextItem] = computeSelectElements(selectedAttributes[previousItem].key, updatedAttributes);
    }

    setSelectElements(updatedSelectElements.filter((_, i) => i !== index));
  };

  const changeDelimiterForSplit = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedAttributes = [...selectedAttributes];
    updatedAttributes[index].value = event.target.value;
    setSelectedAttributes(updatedAttributes);
  };

  useEffect(() => {
    unregister("selector");
    if (Object.keys(selectedGroup).includes("required")) {
      register("selector", { required: translate("input.required") });
    } else {
      register("selector");
    }
    trigger("selector");
  }, [selectedGroup, register, unregister, trigger, setValue, translate]);

  useEffect(() => {
    if (query?.data?.data && !data) {
      const omit = ["name", "_id", "displayName", "selector", "description", "parentId"];

      const selector = query.data.data.selector;
      const selectorEntries = Object.entries(selector);
      const selectorAttributes = selectorEntries
        .filter((attr) => !omit.includes(attr[0]))
        .map((attr) => ({ key: attr[0], value: "" }));

      const updatedSelectElements = [...selectElements];
      selectorAttributes.forEach((attr, index) => {
        if (index !== 0) {
          updatedSelectElements.push(computeSelectElements(selectorAttributes[index - 1].key, selectorAttributes));
        }
      });

      // fill all the field
      omit.forEach(attr => {
        if (attr !== "_id") {
          setValue(attr, selector[attr]);
        }
      });

      setSelectElements(updatedSelectElements);
      setSelectedAttributes(selectorAttributes);
      setData(query.data.data as SelectorData);
    }
  }, [query?.data?.data, data]);

  return (
    <Edit isLoading={formLoading}
      headerProps={{
        title: (<Typography variant="h4">{translate("pages.selectors.edit.title", { id })}</Typography>),
        style: {
          rowGap: "10px",
          paddingTop: 0,
          paddingBottom: 0
        }
      }}
      headerButtons={({ listButtonProps, refreshButtonProps }) => (
        <>
          <ListButton {...listButtonProps} children={translate("pages.selectors.edit.headerButtons.list")}></ListButton>
          <RefreshButton {...refreshButtonProps} children={translate("pages.selectors.edit.headerButtons.refresh")}></RefreshButton>
        </>
      )}
      footerButtons={({ deleteButtonProps, saveButtonProps }) => (
        <>
          <SaveButton {...saveButtonProps}></SaveButton>
          <DeleteButton
            {...deleteButtonProps}
            variant="contained"
            recordItemId={data?.selector?._id}
            confirmTitle={translate("pages.selectors.edit.deleteTitle", { id: data?.selector?._id })}
            confirmCancelText={translate("pages.selectors.edit.deleteOkButton")}
            confirmOkText={translate("pages.selectors.edit.deleteCancelButton")}
          />
        </>
      )}
      saveButtonProps={{
        ...saveButtonProps,
        children: translate("pages.selectors.edit.footerButtons.save"),
        variant: "contained",
        color: "primary",
      }}
      deleteButtonProps={{
        children: translate("pages.selectors.edit.footerButtons.delete")
      }}
    >
      <Grid
        container
        spacing={2}
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit(onFinish)}
      >
        <Grid item sm={12} md={6}>
          <TextField
            {...register("name", {
              required: translate("input.required"),
            })}
            variant="standard"
            error={!!errors?.name}
            helperText={<>{errors?.name?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={translate("pages.selectors.create.nameFieldInputLabel")}
            name="name"
            className="custom-input"
          />
          <TextField
            {...register("displayName", { required: "" })}
            variant="standard"
            error={!!errors?.displayName}
            helperText={<>{errors?.displayName?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={translate("pages.selectors.create.displayNameFieldInputLabel")}
            name="displayName"
            className="custom-input"
          />
          <TextField
            {...register("selector")}
            variant="standard"
            error={!!errors?.selector}
            helperText={<>{errors?.selector?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={translate("pages.selectors.create.selectorInputFieldLabel")}
            name="selector"
            className="custom-input"
          />
          {selectedAttributes.map((attribute, index) => (
            <AttributeField
              attribute={attribute}
              index={index}
              name="attribute"
              selectElements={selectElements}
              key={`attribute-${index}`}
              onChange={handleAttributeChange}
              onDelimiterChange={changeDelimiterForSplit}
              onRemove={() => handleRemoveAttribute(index)}
              setter={setValue}
            />
          ))}
          <Button onClick={handleAddAttribute} sx={{ mt: "20px" }}>{ }</Button>
        </Grid>
        <Grid item sm={12} md={6}>
          <TextField
            {...register("description")}
            variant="standard"
            error={!!errors?.description}
            helperText={<>{errors?.description?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={translate("pages.selectors.create.descriptionInputFieldLabel")}
            name="description"
            className="custom-input"
            multiline={true}
            placeholder={translate("pages.selectors.create.descriptionInputFieldPlaceholder")}
            value={data?.selector?.description}
            inputProps={{ spellCheck: "false" }}
          />
        </Grid>
      </Grid>
    </Edit>
  );
};
