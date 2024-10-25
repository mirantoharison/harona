import React, { useState, useCallback, useEffect } from "react";
import { ListButton, SaveButton } from "@refinedev/mui";
import { Cancel, Translate } from "@mui/icons-material";
import { Box, Typography, Button, Grid, MenuItem, TextField, IconButton } from "@mui/material";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { type HttpError, useNavigation, useTranslation } from "@refinedev/core";
import i18n from "../../i18n";

interface SelectorProps {
  _id: string;
  displayName?: string;
  name: string;
  selector: string;
  description?: string;
  attribute: { key: string; value: any }[];
}

interface Attribute {
  key: string;
  value: boolean | number | string;
}

interface AttributeFieldProps {
  index: number;
  name: string;
  attribute: Attribute;
  selectElements: Array<{ key: string; text: string }[]>;
  onChange: (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDelimiterChange: (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRemove: () => void;
  setter: (key: any, value: any) => void;
}

export const AttributeField: React.FC<AttributeFieldProps> = ({ index, name, attribute, selectElements, onChange, onDelimiterChange, onRemove, setter }) => {
  const { translate } = useTranslation();

  useEffect(() => {
    setter(`attribute.${index}.key`, attribute.key);
    setter(`attribute.${index}.value`, attribute.value);
  }, [attribute.key, attribute.value, index, setter]);

  return (
    <Box sx={{ mt: "20px", display: "flex", columnGap: "5px", alignItems: "flex-end" }}>
      <TextField
        select
        variant="standard"
        label={translate("pages.selectors.create.attributeInputFieldLabel")}
        value={attribute.key}
        onChange={(event) => onChange(index, event)}
        sx={{ minWidth: "300px", "& .MuiInputBase-input": { fontSize: ".875rem" } }}
        InputLabelProps={{ shrink: true }}
        name={name}
      >
        {selectElements[index].map((attr) => (
          <MenuItem key={attr.key} value={attr.key}>
            {attr.text}
          </MenuItem>
        ))}
      </TextField>
      {attribute.key === "split" && (
        <TextField
          variant="standard"
          label={translate("pages.selectors.create.attributeDelimiterInputFieldLabel")}
          sx={{ "& .MuiInputBase-input": { fontSize: ".875rem" } }}
          InputLabelProps={{ shrink: true }}
          onChange={(event) => onDelimiterChange(index, event)}
        />
      )}
      {index !== 0 && (
        <IconButton onClick={onRemove} color="error" sx={{ scale: 0.75 }}>
          <Cancel />
        </IconButton>
      )}
    </Box>
  )
};

export const SelectorAdd: React.FC = () => {
  const { translate } = useTranslation();

  const fieldName = ["name", "displayName", "selector", "description"];
  const getAttributeArray = () => [
    { text: translate("pages.selectors.tags.group"), key: "group" },
    { text: translate("pages.selectors.tags.array"), key: "array" },
    { text: translate("pages.selectors.tags.text"), key: "text" },
    { text: translate("pages.selectors.tags.html"), key: "html" },
    { text: translate("pages.selectors.tags.split"), key: "split" },
    { text: translate("pages.selectors.tags.attribute"), key: "attrText" },
    { text: translate("pages.selectors.tags.number"), key: "firstNumber" },
    { text: translate("pages.selectors.tags.json"), key: "json" },
  ];

  const [selectedGroup, setSelectedGroup] = useState<{ required: string } | {}>({});
  const [selectedAttributes, setSelectedAttributes] = useState<Attribute[]>([{ key: "", value: false }]);
  const [selectElements, setSelectElements] = useState<Array<{ key: string; text: string }[]>>([[...(getAttributeArray())]]);
  const { push } = useNavigation();

  const {
    saveButtonProps,
    refineCore: { formLoading, onFinish },
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    trigger,
    unregister,
    resetField
  } = useForm<SelectorProps, HttpError, SelectorProps>({
    refineCoreProps: {
      resource: "selectors",
      action: "create",
      onMutationError(error, variables, context, isAutoSave) {
        console.log(error);
      },
      onMutationSuccess(data, variables, context, isAutoSave) {
        setTimeout(() => {
          push("/selector/list");
        }, 3000);
      },
    },
  });

  const computeSelectElements = (key: string, selectedAttributes: Attribute[]): Array<{ key: string; text: string }> => {
    const newAttributes: Array<{ key: string; text: string }> = [];
    const selectedKeys = selectedAttributes.map(attr => attr.key);

    if (key === "text") {
      const filteredAttributes = getAttributeArray().filter(attr =>
        (["firstNumber", "split"].includes(attr.key)) ||
        ([...selectedKeys].includes("array") === false && attr.key === "array")
      );
      newAttributes.push(...filteredAttributes);
    } else if (key === "array") {
      const filteredAttributes = getAttributeArray().filter(attr =>
        (["firstNumber", "json", "html"].includes(attr.key)) ||
        ([...selectedKeys].includes("text") === false && attr.key === "text")
      );
      newAttributes.push(...filteredAttributes);
    }

    return newAttributes;
  };

  const handleAttributeChange = useCallback(async (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value) {
      const newAttributes = [...selectedAttributes];
      newAttributes[index] = { key: event.target?.value, value: "" };
      const newGroup = newAttributes.some(attr => attr.key === "group")
        ? {}
        : { required: translate("input.required") };

      setSelectedGroup(newGroup);
      setSelectedAttributes(newAttributes.slice(0, index + 1));

      const updatedSelectElements = [...selectElements];
      if (updatedSelectElements[index + 1]) {
        updatedSelectElements[index + 1] = computeSelectElements(event.target.value, newAttributes);
        setSelectElements(updatedSelectElements.slice(0, index + 1));
      }

      if (newGroup.required) {
        setValue("selector", "");
      }

      await Promise.all(fieldName.map(key => trigger(key as keyof SelectorProps)));

      console.log("updated selectedGroup:", newGroup, "updated selectedAttributes:", newAttributes);
    }
  }, [selectedAttributes, selectElements, translate, trigger, fieldName, setValue]);

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

  const cancel = () => {
    push("/selector/list");
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
    if (selectElements && selectElements.length > 0) {
      const updatedSelectElements = selectElements.map(select => {
        return select.map(attribute => getAttributeArray().filter(attr => attr.key === attribute.key)?.[0]);
      });
      setSelectElements(updatedSelectElements);
    }
  }, [i18n.language]);

  return (
    <Create
      isLoading={formLoading}
      headerProps={{
        title: <Typography variant="h4">{translate("pages.selectors.create.title")}</Typography>
      }}
      headerButtons={({ defaultButtons }) => (
        <>
          <ListButton onClick={cancel}>{translate("pages.selectors.create.headerButtons.list")}</ListButton>
          {defaultButtons}
        </>
      )}
      saveButtonProps={{
        ...saveButtonProps,
        children: "Enregistrer le sélecteur",
        variant: "contained",
        color: "primary",
      }}
      footerButtons={({ defaultButtons, saveButtonProps }) => (
        <>
          <SaveButton {...saveButtonProps} variant="contained" color="primary" children={translate("pages.selectors.create.footerButtons.save")}></SaveButton>
          <Button color="error" variant="contained" onClick={cancel}>{translate("pages.selectors.create.footerButtons.cancel")}</Button>
        </>
      )}
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
            {...register("displayName")}
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
            id="selector-input"
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
            disabled={Object.keys(selectedGroup).length === 0 ? true : false}
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

          <Button onClick={handleAddAttribute} sx={{ mt: "20px" }}>{translate("pages.selectors.create.addAttributeButton")}</Button>
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
          />
        </Grid>
      </Grid>
    </Create>
  );
};
