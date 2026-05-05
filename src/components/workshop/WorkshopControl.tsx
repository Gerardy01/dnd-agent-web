import { Button, Input, Popover, Select } from "antd";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";

// hooks
import { useTranslation } from "react-i18next";

// utils
import { SortEnum } from "@/utils/enums";

// interfaces
interface Props {
    search: string;
    onSearch: (value: string) => void;
    sort?: string;
    onSort?: (value: string) => void;
    onCreate: () => void;
    filterModalContent?: React.ReactNode;
    hideSort?: boolean;
}


export default function WorkshopControl({ search, onSearch, sort, onSort, onCreate, filterModalContent, hideSort }: Props) {

    const { t } = useTranslation();

    return (
        <div style={styles.container}>
            <Input
                placeholder={t('workshop.searchByName')}
                size="large"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
            />
            {filterModalContent && (
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
            )}
            {!hideSort && (
                <Select
                    size="large"
                    options={[
                        { value: SortEnum.RECENT, label: t('workshop.recentlyCreated') },
                        { value: SortEnum.ASC, label: t('workshop.nameAsc') },
                        { value: SortEnum.DESC, label: t('workshop.nameDesc') },
                    ]}
                    value={sort}
                    onChange={(value) => onSort?.(value)}
                    style={{ width: '15rem' }}
                />
            )}
            <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={onCreate}
            >
                {t('workshop.createNew')}
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