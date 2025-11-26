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
            title="My Auctions"
            subtitle="Manage your auctions and track performance"
            fetchFunction={fetchAuctions}
            fetchCategories={fetchCategories}
            emptyStateTitle="No auctions found"
            emptyStateMessage="You haven't created any auctions yet. Start by creating your first auction!"
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
