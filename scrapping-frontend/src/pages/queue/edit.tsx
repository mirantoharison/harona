import { Box, Typography, Button, Grid, MenuItem, TextField, IconButton } from "@mui/material";
import { Settings, Refresh, Inventory, Code, AddBox, DataArray, TextFields, Transform, FormatQuote, LooksOne, DataObject, IndeterminateCheckBox, Search, Cancel } from "@mui/icons-material";
import { useParsed } from "@refinedev/core";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useEffect, useState, useCallback } from "react";
import { DeleteButton, EditButton, List, ShowButton, SaveButton, RefreshButton, ListButton } from "@refinedev/mui";
import { Controller } from "react-hook-form";

export const SelectorEdit = () => {
  const fieldName = ["name", "displayName", "selector", "description"];
  const attributeArray = [
    { text: "Groupe", icon: (<IndeterminateCheckBox sx={{ color: "#5F89B2", scale: .7 }} />), key: "group" },
    { text: "Tableau", icon: (<DataArray sx={{ color: "#7B1FA2", scale: .7 }} />), key: "array" },
    { text: "Texte", icon: (<TextFields sx={{ color: "#FFC900", scale: .7 }} />), key: "text" },
    { text: "HTML", icon: (<Code sx={{ color: "#022FFF", scale: .7 }} />), key: "html" },
    { text: "Split", icon: (<Transform sx={{ color: "#1976D2", scale: .7 }} />), key: "split" },
    { text: "Attribut", icon: (<FormatQuote sx={{ color: "#C464E1", scale: .7 }} />), key: "attrText" },
    { text: "Premier nombre", icon: (<LooksOne sx={{ color: "#E400B0", scale: .7 }} />), key: "firstNumber" },
    { text: "JSON", icon: (<DataObject sx={{ color: "#B80384", scale: .7 }} />), key: "json" }
  ]

  const [data, setData] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(false);
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
    formState: { errors },
  } = useForm({
    refineCoreProps: {
      resource: "selectors",
      action: "edit",
      id: id
    }
  });

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
      setData(query.data.data);
    }
  }, [query?.data?.data, data]);

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

  return (
    <Edit isLoading={formLoading}
      headerProps={{
        title: (<Typography variant="h4">Modifier le sélecteur {id}</Typography>),
        style: {
          rowGap: "10px",
          paddingTop: 0,
          paddingBottom: 0
        }
      }}
      headerButtons={({ listButtonProps, refreshButtonProps }) => (
        <>
          <ListButton {...listButtonProps} children="Liste des sélecteurs"></ListButton>
          <RefreshButton {...refreshButtonProps} children="Rafraichir"></RefreshButton>
        </>
      )}
      footerButtons={({ deleteButtonProps, saveButtonProps }) => (
        <>
          <SaveButton {...saveButtonProps}></SaveButton>
          <DeleteButton
            {...deleteButtonProps}
            variant="contained"
            recordItemId={data?.selector?._id}
            confirmTitle={`Voulez-vous vraiment supprimer le sélecteur : ${data?.selector?._id} ?`}
            confirmCancelText="Annuler"
            confirmOkText="Oui, supprimer"
          />
        </>
      )}
      saveButtonProps={{
        ...saveButtonProps,
        children: "Enregistrer le sélecteur",
        variant: "contained",
        color: "primary",
      }}
      deleteButtonProps={{
        children: "Supprimer"
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
              required: "Ce champs est obligatoire",
            })}
            variant="standard"
            error={!!errors?.name}
            helperText={<>{errors?.name?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"Nom"}
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
            label={"Nom d'affichage"}
            name="displayName"
            className="custom-input"
          />
          <TextField
            {...register("selector", { required: true ? "Ce champs est obligatoire" : "" })}
            variant="standard"
            error={!!errors?.selector}
            helperText={<>{errors?.selector?.message}</>}
            margin="normal"
            fullWidth
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"Sélecteur"}
            name="selector"
            className="custom-input"
          />
          {selectedAttributes.map((attribute, index) => (
            <Box
              key={index}
              sx={{
                mt: "20px",
                display: "flex",
                columnGap: "5px",
                alignItems: "flex-end"
              }}
            >
              <TextField
                select
                variant="standard"
                label="Sélectionner un attribut pour le sélecteur ..."
                value={attribute.key}
                onChange={(event) => handleAttributeChange(index, event)}
                sx={{ minWidth: "300px", "& .MuiInputBase-input": { fontSize: ".875rem" } }}
                InputLabelProps={{ shrink: true }}
              >
                {
                  selectElements[index].map((attr) => (
                    <MenuItem key={attr.key} value={attr.key}>
                      {attr.text}
                    </MenuItem>
                  ))
                }
              </TextField>

              {
                { key: "" }.key === "split" ? (
                  <TextField
                    variant="standard"
                    label="Délimiteur ..."
                    sx={{ "& .MuiInputBase-input": { fontSize: ".875rem" } }}
                    InputLabelProps={{ shrink: true }}
                    onChange={() => { }}
                  >
                  </TextField>
                ) : null
              }

              {
                index !== 0 ? (
                  <IconButton onClick={() => handleRemoveAttribute(index)} color="error" sx={{ scale: .75 }}>
                    <Cancel />
                  </IconButton>
                ) : null
              }
            </Box>
          ))}
          <Button onClick={handleAddAttribute} sx={{ mt: "20px" }}>Ajouter un nouvel attribut</Button>
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
            label={"Description"}
            name="description"
            className="custom-input"
            multiline={true}
            placeholder="VOus pouvez saisir une petite déscription du sélecteur ici."
            value={data?.selector?.description}
            inputProps={{ spellCheck: "false" }}
          />
        </Grid>
      </Grid>
    </Edit>
  );
};
