import { getDefaultFilter, useMany } from "@refinedev/core";

import {
  EditButton,
  FilterDropdown,
  List,
  ShowButton,
  TagField,
  TextField,
  useSelect,
  useTable,
} from "@refinedev/antd";

import { Radio, Select, Space, Table } from "antd";

import { ICategory, IPost } from "../../interfaces";

const PostList = () => {
  const { tableProps, filters } = useTable<IPost>({
    syncWithLocation: true,
  });

  const categoryIds =
    tableProps?.dataSource?.map((item) => item.category.id) ?? [];
  const { data, isLoading } = useMany<ICategory>({
    resource: "categories",
    ids: categoryIds,
    queryOptions: {
      enabled: categoryIds.length > 0,
    },
  });

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories",
    optionLabel: "title",
    optionValue: "id",
    defaultValue: getDefaultFilter("category.id", filters, "in"),
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column
          dataIndex={["category", "id"]}
          title="Category"
          render={(value) => {
            if (isLoading) {
              return <TextField value="Loading..." />;
            }

            return (
              <TextField
                value={data?.data.find((item) => item.id === value)?.title}
              />
            );
          }}
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(selectedKeys) => selectedKeys.map(Number)}
            >
              <Select
                style={{ minWidth: 200 }}
                mode="multiple"
                placeholder="Select Category"
                {...categorySelectProps}
              />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter("category.id", filters, "in")}
        />
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(value: string) => <TagField value={value} />}
          defaultFilteredValue={getDefaultFilter("status", filters)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Radio.Group>
                <Radio value="published">Published</Radio>
                <Radio value="draft">Draft</Radio>
                <Radio value="rejected">Rejected</Radio>
              </Radio.Group>
            </FilterDropdown>
          )}
        />
        <Table.Column<IPost>
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default PostList;
