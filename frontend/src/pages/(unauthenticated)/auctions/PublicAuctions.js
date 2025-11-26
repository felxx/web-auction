import React from 'react';
import { publicAuctionService } from '../../../services/publicAuctionService';
import categoryService from '../../../services/categoryService';
import AuctionList from '../../../components/AuctionList';

const PublicAuctions = () => {
    const fetchAuctions = async (params) => {
        return await publicAuctionService.getPublicAuctions(params);
    };

    const fetchCategories = async () => {
        const data = await categoryService.getAllCategories();
        return data.content;
    };

    return (
        <AuctionList
            title="Leilões Disponíveis"
            subtitle="Encontre os melhores leilões e faça sua oferta"
            fetchFunction={fetchAuctions}
            fetchCategories={fetchCategories}
            emptyStateTitle="Nenhum leilão disponível"
            emptyStateMessage="Não encontramos leilões que correspondam aos seus critérios de busca."
            showCreateButton={false}
            showFilters={true}
            showSearch={true}
            showCategoryFilter={true}
            showStatusFilter={true}
            showSortFilter={true}
        />
    );
};

export default PublicAuctions;
