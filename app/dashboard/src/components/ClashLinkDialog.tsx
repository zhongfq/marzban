import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Stack,
  Switch,
  Text,
  Tooltip,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useClash } from "contexts/ClashContext";
import { FC, useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { tryParseJSON } from "utils/json";
import { z } from "zod";
import { AddIcon, EditIcon, SettingIcon } from "./ClashModal";
import { DeleteIcon } from "./DeleteUserModal";
import { Icon } from "./Icon";

export type ClashLinkDialogProps = {};

export type FormType = Link;

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  tag: z.string().min(1, { message: "Required" }),
  prefix: z.string().min(1, { message: "Required" }),
  url: z.string().min(1, { message: "Required" }),
});

const getDefaultValues = (): FormType => {
  return { id: 0, name: "", tag: "", prefix: "", url: "", modified_at: "" };
};

const formatLink = (link: Link): FormType => {
  return { ...link };
};

export const ClashLinkDialog: FC<ClashLinkDialogProps> = () => {
  const {
    editingLink,
    isCreatingLink,
    onEditingLink,
    onCreateLink,
    deleteLink,
    editLink,
    createLink,
    onAlert,
  } = useClash();
  const isEditing = !!editingLink;
  const isOpen = isCreatingLink || isEditing;
  const title = isEditing ? "clash.link.edited" : "clash.link.created";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const toast = useToast();
  const { t } = useTranslation();
  const form = useForm<FormType>({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (editingLink) {
      form.reset(formatLink(editingLink));
    }
  }, [editingLink]);

  useEffect(() => {
    if (isCreatingLink) {
      form.reset(getDefaultValues());
    }
  }, [isCreatingLink]);

  const submit = (values: FormType) => {
    setLoading(true);
    setError(null);

    let body: Link = {
      ...values,
      id: editingLink?.id,
    };

    (isEditing ? editLink : createLink)(body)
      .then(() => {
        toast({
          title: t(title, { name: values.name }),
          status: "success",
          isClosable: true,
          position: "top",
          duration: 3000,
        });
        onClose();
      })
      .catch((err) => {
        if (
          err?.response?.status === 409 ||
          err?.response?.status === 400 ||
          err?.response?.status === 404
        ) {
          let message = err?.response?._data?.detail;
          if (message.err) {
            message = t(`error.${message.err}`);
          }
          setError(message);
        }
        if (err?.response?.status === 422) {
          Object.keys(err.response._data.detail).forEach((key) => {
            let message = tryParseJSON(err.response._data.detail[key]);
            let tfield = message;
            if (message["err"]) {
              tfield = `error.${message.err}`;
              message = t(tfield);
            }
            setError(message);
            form.setError(key as "tag", {
              type: "custom",
              message: tfield,
            });
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onClose = () => {
    form.reset(getDefaultValues());
    onCreateLink(false);
    onEditingLink(null);
    setError(null);
    setLoading(false);
  };

  const onDeleting = () => {
    onAlert({
      title: t("clash.link.delete"),
      content: t("clash.link.deletePrompt", { name: editingLink?.name }),
      type: "error",
      yes: t("delete"),
      onConfirm: () => {
        deleteLink(editingLink!)
          .then(() => {
            toast({
              title: t("clash.link.deleteSuccess", {
                name: editingLink?.name,
              }),
              status: "success",
              isClosable: true,
              position: "top",
              duration: 3000,
            });
            onClose();
          })
          .catch((err) => {
            toast({
              title: t("clash.link.deleteFail"),
              status: "warning",
              isClosable: true,
              position: "top",
              duration: 3000,
            });
          })
          .finally(() => {
            onAlert(null);
          });
      },
    });
  };

  const terror = (error: string | undefined) => {
    return error ? t(error) : error;
  };

  const disabled = loading;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <FormProvider {...form}>
        <ModalContent mx="3">
          <form onSubmit={form.handleSubmit(submit)}>
            <ModalHeader pt={6}>
              <HStack gap={2}>
                <Icon color="primary">
                  {isEditing ? (
                    <EditIcon color="white" />
                  ) : (
                    <AddIcon color="white" />
                  )}
                </Icon>
                <Text fontWeight="semibold" fontSize="lg">
                  {isEditing ? t("clash.link.edit") : t("clash.link.add")}
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton mt={3} disabled={disabled} />
            <ModalBody>
              <VStack justifyContent="space-between">
                <HStack w="full">
                  <FormControl isInvalid={!!form.formState.errors.name}>
                    <HStack mb="1">
                      <FormLabel mr="0" mb="0">
                        {t("clash.name")}
                      </FormLabel>
                    </HStack>
                    <Input
                      size="sm"
                      type="text"
                      borderRadius="6px"
                      disabled={disabled}
                      {...form.register("name")}
                    />
                    <FormErrorMessage>
                      {terror(form.formState.errors.name?.message)}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
                <HStack w="full" alignItems="baseline">
                  <FormControl
                    w="60%"
                    isInvalid={!!form.formState.errors.prefix}
                  >
                    <FormLabel>{t("clash.link.prefix")}</FormLabel>
                    <Input
                      size="sm"
                      type="text"
                      borderRadius="6px"
                      disabled={disabled}
                      {...form.register("prefix")}
                    />
                    <FormErrorMessage>
                      {terror(form.formState.errors.prefix?.message)}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!form.formState.errors.tag}>
                    <FormLabel>{t("clash.tag")}</FormLabel>
                    <Input
                      size="sm"
                      type="text"
                      borderRadius="6px"
                      disabled={disabled}
                      {...form.register("tag")}
                    />
                    <FormErrorMessage>
                      {terror(form.formState.errors.tag?.message)}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
                <HStack w="full" alignItems="baseline">
                  <FormControl isInvalid={!!form.formState.errors.modified_at}>
                    <FormLabel>{t("clash.modified_at")}</FormLabel>
                    <Input
                      size="sm"
                      type="text"
                      borderRadius="6px"
                      disabled={true}
                      {...form.register("modified_at")}
                    />
                    <FormErrorMessage>
                      {terror(form.formState.errors.modified_at?.message)}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
                <HStack w="full" alignItems="baseline">
                  <FormControl isInvalid={!!form.formState.errors.url}>
                    <FormLabel>{t("clash.url")}</FormLabel>
                    <Input
                      size="sm"
                      type="text"
                      borderRadius="6px"
                      disabled={disabled}
                      {...form.register("url")}
                    />
                    <FormErrorMessage>
                      {terror(form.formState.errors.url?.message)}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter mt="3">
              <HStack justifyContent="space-between" w="full" gap={3}>
                {isEditing && (
                  <Tooltip label={t("delete")} placement="top">
                    <IconButton
                      aria-label="Delete"
                      size="sm"
                      onClick={onDeleting}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <HStack w="full" justifyItems="flex-end">
                  <Button
                    onClick={onClose}
                    size="sm"
                    variant="outline"
                    w="full"
                    disabled={disabled}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    colorScheme="primary"
                    leftIcon={loading ? <Spinner size="xs" /> : undefined}
                    w="full"
                    isDisabled={disabled || !form.formState.isDirty}
                  >
                    {isEditing ? t("clash.update") : t("clash.create")}
                  </Button>
                </HStack>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </FormProvider>
    </Modal>
  );
};
