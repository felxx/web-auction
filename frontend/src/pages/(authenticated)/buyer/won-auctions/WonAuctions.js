import React from 'react';
import auctionService from '../../../../services/auctionService';
import categoryService from '../../../../services/categoryService';
import AuctionList from '../../../../components/AuctionList';

const WonAuctions = () => {
    const fetchAuctions = async (params) => {
        const response = await auctionService.getWonAuctions(
            params.page,
            params.size,
            params.sort,
            {
                search: params.search,
                categoryId: params.categoryId
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
            title="Leilões Ganhos"
            subtitle="Parabéns! Veja os leilões que você venceu"
            fetchFunction={fetchAuctions}
            fetchCategories={fetchCategories}
            emptyStateTitle="Nenhum leilão ganho"
            emptyStateMessage="Você ainda não ganhou nenhum leilão. Continue participando e boa sorte!"
            showCreateButton={false}
            showFilters={true}
            showSearch={true}
            showCategoryFilter={true}
            showStatusFilter={false}
            showSortFilter={true}
        />
    );
};

export default WonAuctions;
