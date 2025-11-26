import React from 'react';
import auctionService from '../../../../services/auctionService';
import categoryService from '../../../../services/categoryService';
import AuctionList from '../../../../components/AuctionList';

const MyAuctions = () => {
    const fetchAuctions = async (params) => {
        const response = await auctionService.getAuctions(
            params.page,
            params.size,
            params.sort,
            {
                search: params.search,
                categoryId: params.categoryId,
                status: params.status
            }
        );
        return response.data;
    };

    const fetchCategories = async () => {
        const response = await categoryService.getCategories();
        return response.data.content;
    };

    return (
        <AuctionList
            title="Meus Leilões"
            subtitle="Gerencie seus leilões e acompanhe o desempenho"
            fetchFunction={fetchAuctions}
            fetchCategories={fetchCategories}
            emptyStateTitle="Nenhum leilão encontrado"
            emptyStateMessage="Você ainda não criou nenhum leilão. Comece criando seu primeiro leilão!"
            showCreateButton={true}
            createButtonRoute="/auctions/new"
            showFilters={true}
            showSearch={true}
            showCategoryFilter={true}
            showStatusFilter={true}
            showSortFilter={true}
        />
    );
};

export default MyAuctions;
