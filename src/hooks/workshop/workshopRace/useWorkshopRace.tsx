import { useEffect, useState } from "react";

// api
import { workshopRaceApi, workshopSpellApi } from "@/api";

// utils
import { SortEnum } from "@/utils/enums";

// hooks
import useStaticModal from "@/hooks/global/useStaticModal";
import useNotification from "@/hooks/global/useNotification";

// interfaces
import type { WorkshopRaceDetailReturn, WorkshopRaceReturn, UpdateWorkshopRaceDTO, RaceWrite } from "@/models/raceInterfaces";
import type { WorkshopSpellReturn } from "@/models/spellInterfaces";

export default function useWorkshopRace() {

    const { serverErrorModal, errorModal } = useStaticModal();
    const { successNotification } = useNotification();

    const [loading, setLoading] = useState<boolean>(true);
    const [getRaceLoading, setGetRaceLoading] = useState<boolean>(true);
    const [getSpellsLoading, setGetSpellsLoading] = useState<boolean>(true);

    const [workshopRaces, setWorkshopRaces] = useState<WorkshopRaceReturn[]>([]);
    const [filteredWorkshopRaces, setFilteredWorkshopRaces] = useState<WorkshopRaceReturn[]>([]);
    const [spells, setSpells] = useState<WorkshopSpellReturn[]>([]);

    const [search, setSearch] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>("");
    const [sortValue, setSortValue] = useState<string>(SortEnum.RECENT);

    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
    const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
    const [editedRaceId, setEditedRaceId] = useState<number | null>(null);

    const [cardWidth, setCardWidth] = useState<string>(
        window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%'
    );

    useEffect(() => {
        getWorkshopRaceData();
        getWorkshopSpellsData();
    }, []);

    useEffect(() => {
        if (getRaceLoading || getSpellsLoading) return;

        setLoading(false);
    }, [getRaceLoading, getSpellsLoading]);

    useEffect(() => {
        const handleResize = () => {
            setCardWidth(window.innerWidth <= 1170 ? '48%' : window.innerWidth <= 1475 ? '32%' : '24%');
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setFilteredWorkshopRaces(workshopRaces);
    }, [workshopRaces]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchValue(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (!searchValue) return setFilteredWorkshopRaces(workshopRaces);

        let filtered = [...workshopRaces];

        if (searchValue) {
            filtered = filtered.filter((race) =>
                race.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        setFilteredWorkshopRaces(filtered);
    }, [searchValue, workshopRaces]);

    useEffect(() => {
        if (sortValue === SortEnum.RECENT) {
            setFilteredWorkshopRaces((prev) => [...prev].sort((a, b) => {
                if (!b.createdAt || !a.createdAt) return 0;
                return b.createdAt.toString().localeCompare(a.createdAt.toString());
            }));
        }

        if (sortValue === SortEnum.ASC) {
            setFilteredWorkshopRaces((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
        }

        if (sortValue === SortEnum.DESC) {
            setFilteredWorkshopRaces((prev) => [...prev].sort((a, b) => b.name.localeCompare(a.name)));
        }
    }, [sortValue, searchValue]);

    const getWorkshopRaceData = async () => {
        setGetRaceLoading(true);

        try {
            const [err, res] = await workshopRaceApi.getRaces();

            if (err) {
                serverErrorModal();
                return;
            }

            setWorkshopRaces(res);
            setFilteredWorkshopRaces(res);

        } finally {
            setGetRaceLoading(false);
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

    const handleSelectRace = (raceId: number | null) => {
        setSelectedRaceId(raceId);
    }

    const handleCreateRace = async (data: RaceWrite): Promise<void> => {
        const [err, res] = await workshopRaceApi.createRace(data);

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

        successNotification("Race created successfully");

        uponCreated(res.workshopRaceId);
    }

    const handleEditRace = async (data: RaceWrite): Promise<void> => {
        if (!editedRaceId) return;

        const prevRace = workshopRaces.find((r) => r.workshopRaceId === editedRaceId);
        if (!prevRace) return;

        const isImageUpdated = data.image !== prevRace.image;

        const updateData: UpdateWorkshopRaceDTO = {
            ...data,
            workshopRaceId: editedRaceId,
            isImageUpdated: isImageUpdated,
        };

        const [err, res] = await workshopRaceApi.editRace(updateData);

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

        successNotification("Race edited successfully");

        uponEdited(res.workshopRaceId);
    }

    const uponCreated = async (workshopRaceId: number) => {
        const [err, res] = await workshopRaceApi.getOneRace(workshopRaceId);

        if (err) {
            serverErrorModal();
            return;
        }

        if (sortValue === SortEnum.RECENT) {
            setWorkshopRaces((prev) => [res, ...prev]);
            return;
        }

        setWorkshopRaces((prev) => [...prev, res]);
    }

    const uponEdited = async (workshopRaceId: number) => {
        const [err, res] = await workshopRaceApi.getOneRace(workshopRaceId);

        if (err) {
            serverErrorModal();
            return;
        }

        setWorkshopRaces((prev) => prev.map((r) => r.workshopRaceId === res.workshopRaceId ? res : r));
    }

    const uponDelete = async (workshopRaceId: number) => {
        setWorkshopRaces((prev) => prev.filter((r) => r.workshopRaceId !== workshopRaceId));
    }

    const handleEditRaceClick = (raceId: number | null) => {
        setEditedRaceId(raceId);
    }

    const handleGetRaceDetails = async (): Promise<WorkshopRaceDetailReturn | null> => {
        const raceId = selectedRaceId || editedRaceId;
        if (!raceId) return null;

        const [err, res] = await workshopRaceApi.getDetailedRace(raceId);

        if (err) {
            serverErrorModal();
            return null;
        }

        return res;
    }


    return {
        races: filteredWorkshopRaces,
        loading,
        search,
        sortValue,
        createModalOpen,
        cardWidth,
        selectedRaceId,
        editedRaceId,
        handleSearch,
        handleSort,
        handleCreateModal,
        handleSelectRace,
        handleCreateRace,
        handleEditRace,
        handleEditRaceClick,
        handleGetRaceDetails,
        uponDelete,
        spells,
    }
}
