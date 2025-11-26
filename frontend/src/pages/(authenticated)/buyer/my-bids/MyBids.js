import React from 'react';
import auctionService from '../../../../services/auctionService';
import categoryService from '../../../../services/categoryService';
import AuctionList from '../../../../components/AuctionList';

const MyBids = () => {
    const fetchAuctions = async (params) => {
        const response = await auctionService.getMyBids(
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
            title="Meus Lances"
            subtitle="Acompanhe os leilões nos quais você participou"
            fetchFunction={fetchAuctions}
            fetchCategories={fetchCategories}
            emptyStateTitle="Nenhum lance encontrado"
            emptyStateMessage="Você ainda não deu lances em nenhum leilão. Explore os leilões disponíveis e faça sua primeira oferta!"
            showCreateButton={false}
            showFilters={true}
            showSearch={true}
            showCategoryFilter={true}
            showStatusFilter={true}
            showSortFilter={true}
        />
    );
};

export default MyBids;
