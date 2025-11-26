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
            title="Available Auctions"
            subtitle="Find the best auctions and place your bid"
            fetchFunction={fetchAuctions}
            fetchCategories={fetchCategories}
            emptyStateTitle="No auctions available"
            emptyStateMessage="We couldn't find auctions matching your search criteria."
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
