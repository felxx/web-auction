import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import AuctionCard from '../AuctionCard/AuctionCard';
import './AuctionList.css';

/**
 * Componente reutilizável para exibir listas de leilões com filtros e paginação
 * @param {Object} props
 * @param {string} props.title - Título da página
 * @param {string} props.subtitle - Subtítulo da página
 * @param {Function} props.fetchFunction - Função para buscar os leilões (deve retornar uma Promise)
 * @param {Function} props.fetchCategories - Função para buscar as categorias (opcional)
 * @param {string} props.emptyStateTitle - Título do estado vazio
 * @param {string} props.emptyStateMessage - Mensagem do estado vazio
 * @param {boolean} props.showCreateButton - Se deve mostrar o botão de criar leilão
 * @param {string} props.createButtonRoute - Rota para criar novo leilão
 * @param {boolean} props.showFilters - Se deve mostrar os filtros (padrão: true)
 * @param {boolean} props.showSearch - Se deve mostrar a busca (padrão: true)
 * @param {boolean} props.showCategoryFilter - Se deve mostrar filtro de categoria (padrão: true)
 * @param {boolean} props.showStatusFilter - Se deve mostrar filtro de status (padrão: true)
 * @param {boolean} props.showSortFilter - Se deve mostrar filtro de ordenação (padrão: true)
 */
const AuctionList = ({
    title,
    subtitle,
    fetchFunction,
    fetchCategories,
    emptyStateTitle = 'Nenhum leilão disponível',
    emptyStateMessage = 'Não encontramos leilões que correspondam aos seus critérios de busca.',
    showCreateButton = false,
    createButtonRoute = '/auctions/new',
    showFilters = true,
    showSearch = true,
    showCategoryFilter = true,
    showStatusFilter = true,
    showSortFilter = true,
}) => {
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('OPEN');
    const [sortOrder, setSortOrder] = useState('endDateTime,asc');
    
    // Pagination
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(12);
    const [totalRecords, setTotalRecords] = useState(0);
    
    const statusOptions = [
        { label: 'Leilões Abertos', value: 'OPEN' },
        { label: 'Leilões Encerrados', value: 'CLOSED' },
        { label: 'Todos os Leilões', value: '' }
    ];
    
    const sortOptions = [
        { label: 'Termina em breve', value: 'endDateTime,asc' },
        { label: 'Mais recentes', value: 'startDateTime,desc' },
        { label: 'Maior preço', value: 'minimumBid,desc' },
        { label: 'Menor preço', value: 'minimumBid,asc' }
    ];
    
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
            setCategories([{ label: 'Todas as categorias', value: null }, ...categoryOptions]);
        } catch (err) {
            console.error('Erro ao carregar categorias:', err);
        }
    };
    
    const loadAuctions = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const params = {
                search: search || undefined,
                categoryId: selectedCategory || undefined,
                status: selectedStatus || undefined,
                page: first / rows,
                size: rows,
                sort: sortOrder
            };
            
            const data = await fetchFunction(params);
            setAuctions(data.content);
            setTotalRecords(data.totalElements);
        } catch (err) {
            console.error('Erro ao carregar leilões:', err);
            setError('Não foi possível carregar os leilões. Por favor, tente novamente.');
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
                        label="Criar Leilão"
                        icon="pi pi-plus"
                        className="p-button-success mt-3"
                        onClick={() => navigate(createButtonRoute)}
                    />
                )}
                {(search || selectedCategory) && !showCreateButton && (
                    <Button
                        label="Limpar filtros"
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
                    label="Tentar novamente"
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
                            label="Criar Leilão"
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
                <section className="filters-section" role="search" aria-label="Filtros de busca">
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
                                        placeholder="Buscar leilões..."
                                        className="w-full"
                                        aria-label="Buscar leilões por título ou descrição"
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
                                    placeholder="Categoria"
                                    className="w-full"
                                    aria-label="Filtrar por categoria"
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
                                    aria-label="Filtrar por status"
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
                                    aria-label="Ordenar leilões"
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}
            
            <section className="auctions-section" aria-label="Lista de leilões">
                {error ? (
                    renderErrorState()
                ) : loading ? (
                    <div className="auctions-grid" role="list" aria-busy="true" aria-label="Carregando leilões">
                        {renderSkeletons()}
                    </div>
                ) : auctions.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <>
                        <div className="auctions-grid" role="list" aria-label={`${totalRecords} leilões encontrados`}>
                            {auctions.map(auction => (
                                <div key={auction.id} role="listitem">
                                    <AuctionCard auction={auction} />
                                </div>
                            ))}
                        </div>
                        
                        {totalRecords > rows && (
                            <nav aria-label="Paginação de leilões">
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
