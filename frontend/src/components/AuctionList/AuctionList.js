import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import AuctionCard from '../AuctionCard/AuctionCard';
import './AuctionList.css';

const AuctionList = ({
    title,
    subtitle,
    fetchFunction,
    fetchCategories,
    emptyStateTitle = 'No auctions available',
    emptyStateMessage = 'We couldn\'t find auctions matching your search criteria.',
    showCreateButton = false,
    createButtonRoute = '/auctions/new',
    showFilters = true,
    showSearch = true,
    showCategoryFilter = true,
    showStatusFilter = true,
    showSortFilter = true,
}) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [auctions, setAuctions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('OPEN');
    const [sortOrder, setSortOrder] = useState('endDateTime,asc');
    
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(12);
    const [totalRecords, setTotalRecords] = useState(0);
    
    const statusOptions = [
        { label: 'Open Auctions', value: 'OPEN' },
        { label: 'Scheduled Auctions', value: 'SCHEDULED' },
        { label: 'Closed Auctions', value: 'CLOSED' },
        { label: 'All Auctions', value: '' }
    ];
    
    const sortOptions = [
        { label: 'Ending soon', value: 'endDateTime,asc' },
        { label: 'Most recent', value: 'startDateTime,desc' },
        { label: 'Highest price', value: 'minimumBid,desc' },
        { label: 'Lowest price', value: 'minimumBid,asc' }
    ];
    
    // Read URL parameters on mount
    useEffect(() => {
        const categoryIdFromUrl = searchParams.get('categoryId');
        const searchFromUrl = searchParams.get('search');
        
        if (categoryIdFromUrl) {
            setSelectedCategory(Number(categoryIdFromUrl));
        }
        if (searchFromUrl) {
            setSearch(searchFromUrl);
        }
    }, [searchParams]);
    
    useEffect(() => {
        if (fetchCategories && showCategoryFilter) {
            loadCategories();
        }
    }, [fetchCategories, showCategoryFilter]);
    
    useEffect(() => {
        loadAuctions();
    }, [search, selectedCategory, selectedStatus, sortOrder, first, rows]);
    
    const loadCategories = async () => {
        try {
            const data = await fetchCategories();
            const categoryOptions = data.map(cat => ({
                label: cat.name,
                value: cat.id
            }));
            setCategories([{ label: 'All categories', value: null }, ...categoryOptions]);
        } catch (err) {
            console.error('Error loading categories:', err);
        }
    };
    
    const loadAuctions = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const params = {
                search: search || undefined,
                categoryId: selectedCategory !== null ? selectedCategory : undefined,
                status: selectedStatus || undefined,
                page: first / rows,
                size: rows,
                sort: sortOrder
            };
            
            const data = await fetchFunction(params);
            setAuctions(data.content);
            setTotalRecords(data.totalElements);
        } catch (err) {
            console.error('Error loading auctions:', err);
            setError('Unable to load auctions. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };
    
    const handleRetry = () => {
        loadAuctions();
    };
    
    const handleClearFilters = () => {
        setSearch('');
        setSelectedCategory(null);
    };
    
    const renderSkeletons = () => {
        return Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="auction-card-skeleton">
                <Skeleton width="100%" height="200px" className="mb-3" />
                <Skeleton width="80%" height="1.5rem" className="mb-2" />
                <Skeleton width="60%" height="1rem" className="mb-2" />
                <Skeleton width="100%" height="3rem" />
            </div>
        ));
    };
    
    const renderEmptyState = () => {
        return (
            <div className="empty-state" role="status" aria-live="polite">
                <i className="pi pi-inbox" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                <h3>{emptyStateTitle}</h3>
                <p>{emptyStateMessage}</p>
                {showCreateButton && (
                    <Button
                        label="Create Auction"
                        icon="pi pi-plus"
                        className="p-button-success mt-3"
                        onClick={() => navigate(createButtonRoute)}
                    />
                )}
                {(search || selectedCategory) && !showCreateButton && (
                    <Button
                        label="Clear filters"
                        icon="pi pi-filter-slash"
                        className="p-button-outlined"
                        onClick={handleClearFilters}
                    />
                )}
            </div>
        );
    };
    
    const renderErrorState = () => {
        return (
            <div className="error-state" role="alert" aria-live="assertive">
                <Message severity="error" text={error} />
                <Button
                    label="Try again"
                    icon="pi pi-refresh"
                    onClick={handleRetry}
                    className="mt-3"
                />
            </div>
        );
    };
    
    return (
        <main className="auction-list-page">
            <header className="page-header">
                {showCreateButton ? (
                    <div className="header-content">
                        <div className="header-text">
                            <h1>{title}</h1>
                            <p>{subtitle}</p>
                        </div>
                        <Button
                            label="Create Auction"
                            icon="pi pi-plus"
                            className="p-button-success create-auction-btn"
                            onClick={() => navigate(createButtonRoute)}
                        />
                    </div>
                ) : (
                    <>
                        <h1>{title}</h1>
                        <p>{subtitle}</p>
                    </>
                )}
            </header>
            
            {showFilters && (
                <section className="filters-section" role="search" aria-label="Search filters">
                    <div className={`filters-row ${
                        [showSearch, showCategoryFilter, showStatusFilter, showSortFilter].filter(Boolean).length === 3 
                        ? 'filters-row-3' 
                        : [showSearch, showCategoryFilter, showStatusFilter, showSortFilter].filter(Boolean).length === 2 
                        ? 'filters-row-2' 
                        : ''
                    }`}>
                        {showSearch && (
                            <div className="search-input-wrapper">
                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-search" />
                                    <InputText
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search auctions..."
                                        className="w-full"
                                        aria-label="Search auctions by title or description"
                                    />
                                </span>
                            </div>
                        )}
                        
                        {showCategoryFilter && (
                            <div className="filter-dropdown">
                                <Dropdown
                                    value={selectedCategory}
                                    options={categories}
                                    onChange={(e) => setSelectedCategory(e.value)}
                                    placeholder="Category"
                                    className="w-full"
                                    aria-label="Filter by category"
                                />
                            </div>
                        )}
                        
                        {showStatusFilter && (
                            <div className="filter-dropdown">
                                <Dropdown
                                    value={selectedStatus}
                                    options={statusOptions}
                                    onChange={(e) => setSelectedStatus(e.value)}
                                    className="w-full"
                                    aria-label="Filter by status"
                                />
                            </div>
                        )}
                        
                        {showSortFilter && (
                            <div className="filter-dropdown">
                                <Dropdown
                                    value={sortOrder}
                                    options={sortOptions}
                                    onChange={(e) => setSortOrder(e.value)}
                                    className="w-full"
                                    aria-label="Sort auctions"
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}
            
            <section className="auctions-section" aria-label="Auction list">
                {error ? (
                    renderErrorState()
                ) : loading ? (
                    <div className="auctions-grid" role="list" aria-busy="true" aria-label="Loading auctions">
                        {renderSkeletons()}
                    </div>
                ) : auctions.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <>
                        <div className="auctions-grid" role="list" aria-label={`${totalRecords} auctions found`}>
                            {auctions.map(auction => (
                                <div key={auction.id} role="listitem">
                                    <AuctionCard auction={auction} />
                                </div>
                            ))}
                        </div>
                        
                        {totalRecords > rows && (
                            <nav aria-label="Auction pagination">
                                <Paginator
                                    first={first}
                                    rows={rows}
                                    totalRecords={totalRecords}
                                    rowsPerPageOptions={[12, 24, 48]}
                                    onPageChange={onPageChange}
                                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                />
                            </nav>
                        )}
                    </>
                )}
            </section>
        </main>
    );
};

export default AuctionList;
