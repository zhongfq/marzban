import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  HStack,
  Select,
  Text,
} from "@chakra-ui/react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import { ChangeEvent, FC } from "react";
import { useTranslation } from "react-i18next";
import { setUsersPerPageLimitSize } from "utils/userPreferenceStorage";

const PrevIcon = chakra(ChevronDoubleLeftIcon, {
  baseStyle: {
    w: 4,
    h: 4,
  },
});
const NextIcon = chakra(ChevronDoubleRightIcon, {
  baseStyle: {
    w: 4,
    h: 4,
  },
});

const MINIMAL_PAGE_ITEM_COUNT = 5;

/**
 * Generate numeric page items around current page.
 *   - Always include first and last page
 *   - Add ellipsis if needed
 */
function generatePageItems(total: number, current: number, width: number) {
  if (width < MINIMAL_PAGE_ITEM_COUNT) {
    throw new Error(
      `Must allow at least ${MINIMAL_PAGE_ITEM_COUNT} page items`
    );
  }
  if (width % 2 === 0) {
    throw new Error(`Must allow odd number of page items`);
  }
  if (total < width) {
    return [...new Array(total).keys()];
  }
  const left = Math.max(
    0,
    Math.min(total - width, current - Math.floor(width / 2))
  );
  const items: (string | number)[] = new Array(width);
  for (let i = 0; i < width; i += 1) {
    items[i] = i + left;
  }
  // replace non-ending items with placeholders
  if ((items[0] as number) > 0) {
    items[0] = 0;
    items[1] = "prev-more";
  }
  if ((items[items.length - 1] as number) < total - 1) {
    items[items.length - 1] = total - 1;
    items[items.length - 2] = "next-more";
  }
  return items;
}

export type PaginationProps = {
  total: number;
  limit?: number;
  offset?: number;
  onChange: (page: number, limit: number) => void;
};

export const Pagination: FC<PaginationProps> = ({
  onChange,
  total,
  limit,
  offset,
}) => {
  const page = (offset || 0) / (limit || 1);
  const noPages = Math.ceil(total / (limit || 1));
  const pages = generatePageItems(noPages, page, 7);

  const changePage = (page: number) => {
    onChange(page, limit!);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(page, parseInt(e.target.value));
    setUsersPerPageLimitSize(e.target.value);
  };

  const { t } = useTranslation();

  return (
    <HStack
      justifyContent="space-between"
      mt={4}
      w="full"
      display="flex"
      columnGap={{ lg: 4, md: 0 }}
      rowGap={{ md: 0, base: 4 }}
      flexDirection={{ md: "row", base: "column" }}
    >
      <Box order={{ base: 2, md: 1 }}>
        <HStack>
          <Select
            minW="60px"
            value={limit}
            onChange={handlePageSizeChange}
            size="sm"
            rounded="md"
          >
            <option>10</option>
            <option>20</option>
            <option>30</option>
          </Select>
          <Text whiteSpace={"nowrap"} fontSize="sm">
            {t("itemsPerPage")}
          </Text>
        </HStack>
      </Box>

      <ButtonGroup
        size="sm"
        isAttached
        variant="outline"
        order={{ base: 1, md: 2 }}
      >
        <Button
          leftIcon={<PrevIcon />}
          onClick={changePage.bind(null, page - 1)}
          isDisabled={page === 0 || noPages === 0}
        >
          {t("previous")}
        </Button>
        {pages.map((pageIndex) => {
          if (typeof pageIndex === "string")
            return <Button key={pageIndex}>...</Button>;
          return (
            <Button
              key={pageIndex}
              variant={(pageIndex as number) === page ? "solid" : "outline"}
              onClick={changePage.bind(null, pageIndex)}
            >
              {(pageIndex as number) + 1}
            </Button>
          );
        })}

        <Button
          rightIcon={<NextIcon />}
          onClick={changePage.bind(null, page + 1)}
          isDisabled={page + 1 === noPages || noPages === 0}
        >
          {t("next")}
        </Button>
      </ButtonGroup>
    </HStack>
  );
};
