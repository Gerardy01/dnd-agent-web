import { useEffect, useState } from "react";

// api
import { workshopClassApi, workshopSpellApi } from "@/api";

// utils
import { SortEnum } from "@/utils/enums";

// hooks
import useStaticModal from "@/hooks/global/useStaticModal";
import useNotification from "@/hooks/global/useNotification";

// interfaces
import type { CreateClassDTO, UpdateWorkshopClassDTO, WorkshopClassDetailReturn, WorkshopClassReturn } from "@/models/classInterfaces";
import type { WorkshopSpellReturn } from "@/models/spellInterfaces";



export default function useWorkshopClass() {

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successNotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(true);
    const [getClassLoading, setGetClassLoading] = useState<boolean>(true);
    const [getSpellsLoading, setGetSpellsLoading] = useState<boolean>(true);

    const [workshopClasses, setWorkshopClasses] = useState<WorkshopClassReturn[]>([]);
    const [filteredWorkshopClasses, setFilteredWorkshopClasses] = useState<WorkshopClassReturn[]>([]);
    const [spells, setSpells] = useState<WorkshopSpellReturn[]>([]);

    const [search, setSearch] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortValue, setSortValue] = useState<string>(SortEnum.RECENT);

    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [editedClassId, setEditedClassId] = useState<number | null>(null);

    const [cardWidth, setCardWidth] = useState<string>(
        window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%'
    );

    useEffect(() => {
        getWorkshopClassData();
        getWorkshopSpellsData();
    }, []);

    useEffect(() => {
        if (getClassLoading || getSpellsLoading) return;

        setLoading(false);
    }, [getClassLoading, getSpellsLoading]);

    useEffect(() => {
        const handleResize = () => {
            setCardWidth(window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setFilteredWorkshopClasses(workshopClasses);
    }, [workshopClasses]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchValue(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (!searchValue) return setFilteredWorkshopClasses(workshopClasses);

        let filtered = [...workshopClasses];

        if (searchValue) {
            filtered = filtered.filter((cls) =>
                cls.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        setFilteredWorkshopClasses(filtered);
    }, [searchValue, workshopClasses]);

    useEffect(() => {
        if (sortValue === SortEnum.RECENT) {
            setFilteredWorkshopClasses((prev) => [...prev].sort((a, b) => b.createdAt.toString().localeCompare(a.createdAt.toString())));
        }

        if (sortValue === SortEnum.ASC) {
            setFilteredWorkshopClasses((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
        }

        if (sortValue === SortEnum.DESC) {
            setFilteredWorkshopClasses((prev) => [...prev].sort((a, b) => b.name.localeCompare(a.name)));
        }
    }, [sortValue, searchValue]);

    const getWorkshopClassData = async () => {
        setGetClassLoading(true);

        try {
            const [err, res] = await workshopClassApi.getClasses();

            if (err) {
                serverErrorModal();
                return;
            }

            setWorkshopClasses(res);
            setFilteredWorkshopClasses(res);

        } finally {
            setGetClassLoading(false);
        }
    }

    const getWorkshopSpellsData = async () => {
        setGetSpellsLoading(true);

        try {
            const [err, res] = await workshopSpellApi.getSpells();

            if (err) {
                serverErrorModal();
                return;
            }

            setSpells(res);
        } finally {
            setGetSpellsLoading(false);
        }
    }

    const handleSearch = (value: string) => {
        setSearch(value);
    }

    const handleSort = (value: string) => {
        setSortValue(value);
    }

    const handleCreateModal = (value: boolean) => {
        setCreateModalOpen(value);
    }

    const handleSelectClass = (classId: number | null) => {
        setSelectedClassId(classId);
    }

    const handleCreateClass = async (data: CreateClassDTO): Promise<void> => {
        const [err, res] = await workshopClassApi.createClass(data);

        if (err) {
            if (err.status === 400) {
                const error = err.response?.data?.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                if (!error) return;
                errorModal(undefined, `${error.field} is ${error.message}`);
                return;
            }

            serverErrorModal();
            return;
        }

        successNotification("Class created successfully");

        uponCreated(res.workshopClassId);
    }

    const handleEditClass = async (data: WorkshopClassDetailReturn, prevData: WorkshopClassDetailReturn): Promise<void> => {
        const isImageUpdated = data.image !== prevData.image;

        const updateData: UpdateWorkshopClassDTO = {
            ...data,
            workshopClassId: prevData.workshopClassId || 0,
            isImageUpdated: isImageUpdated,
        }

        const [err, res] = await workshopClassApi.editClass(updateData);

        if (err) {
            if (err.status === 400) {
                const error = err.response?.data?.schemaErrors ? err.response.data.schemaErrors[0] : undefined;
                if (!error) return;
                errorModal(undefined, `${error.field} is ${error.message}`);
                return;
            }

            serverErrorModal();
            return;
        }

        successNotification("Class edited successfully");

        uponEdited(res.workshopClassId);
    }

    const uponCreated = async (workshopClassId: number) => {
        const [err, res] = await workshopClassApi.getOneClass(workshopClassId);

        if (err) {
            serverErrorModal();
            return;
        }

        if (sortValue === SortEnum.RECENT) {
            setWorkshopClasses((prev) => [res, ...prev]);
            return;
        }

        setWorkshopClasses((prev) => [...prev, res]);
    }

    const uponEdited = async (workshopClassId: number) => {
        const [err, res] = await workshopClassApi.getOneClass(workshopClassId);

        if (err) {
            serverErrorModal();
            return;
        }

        setWorkshopClasses((prev) => prev.map((cls) => cls.workshopClassId === res.workshopClassId ? res : cls));
    }

    const uponDelete = async (workshopClassId: number) => {
        setWorkshopClasses((prev) => prev.filter((cls) => cls.workshopClassId !== workshopClassId));
    }

    const handleEditClassClick = (classId: number | null) => {
        setEditedClassId(classId);
    }

    const handleGetClassDetails = async (): Promise<WorkshopClassDetailReturn | null> => {
        const classId = selectedClassId || editedClassId;
        if (!classId) return null;

        const [err, res] = await workshopClassApi.getDetailedClass(classId);

        if (err) {
            serverErrorModal();
            return null;
        }

        return res;
    }


    return {
        classes: filteredWorkshopClasses,
        loading,
        search,
        sortValue,
        createModalOpen,
        cardWidth,
        selectedClassId,
        editedClassId,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleSelectClass,
        handleCreateClass,
        handleEditClass,
        handleEditClassClick,
        handleGetClassDetails,
        uponDelete,
        spells,
    }
}
