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
            title="My Bids"
            subtitle="Track the auctions you participated in"
            fetchFunction={fetchAuctions}
            fetchCategories={fetchCategories}
            emptyStateTitle="No bids found"
            emptyStateMessage="You haven't placed bids on any auctions yet. Explore available auctions and make your first offer!"
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
