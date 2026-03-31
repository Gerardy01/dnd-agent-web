import { Button, Input, Popover, Select } from "antd";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";

// utils
import { SortEnum } from "@/utils/enums";

// interfaces
interface Props {
    search: string;
    onSearch: (value: string) => void;
    sort: string;
    onSort: (value: string) => void;
    onCreate: () => void;
    filterModalContent?: React.ReactNode;
}


export default function WorkshopControl({ search, onSearch, sort, onSort, onCreate, filterModalContent }: Props) {
    return (
        <div style={styles.container}>
            <Input
                placeholder="Search by name..."
                size="large"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
            />
            <Popover
                content={filterModalContent}
                trigger="click"
                placement="bottom"
            >
                <Button
                    icon={<FilterOutlined />}
                    size="large"
                    style={styles.filterButton}
                />
            </Popover>
            <Select
                size="large"
                options={[
                    { value: SortEnum.RECENT, label: 'Recently Created' },
                    { value: SortEnum.ASC, label: 'Name (A-Z)' },
                    { value: SortEnum.DESC, label: 'Name (Z-A)' },
                ]}
                value={sort}
                onChange={(value) => onSort(value)}
                style={{ width: '15rem' }}
            />
            <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={onCreate}
            >
                Create New
            </Button>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        gap: '0.5rem'
    },
    filterButton: {
        width: '3rem',
        background: 'none',
        border: 'none',
    }
}