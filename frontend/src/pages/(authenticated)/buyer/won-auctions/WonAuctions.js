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
            title="Won Auctions"
            subtitle="Congratulations! See the auctions you won"
            fetchFunction={fetchAuctions}
            fetchCategories={fetchCategories}
            emptyStateTitle="No auctions won"
            emptyStateMessage="You haven't won any auctions yet. Keep participating and good luck!"
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
