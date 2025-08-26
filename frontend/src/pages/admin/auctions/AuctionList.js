import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Skeleton } from 'primereact/skeleton';
import auctionService from '../../../services/auctionService';
import './AuctionList.css';

const AuctionList = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        setLoading(true);
        try {
            const response = await auctionService.getAuctions();
            setAuctions(response.data.content);
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load auctions.',
                life: 5000
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (auction) => {
        confirmDialog({
            message: `Are you sure you want to delete the auction "${auction.title}"?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await auctionService.deleteAuction(auction.id);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Auction deleted successfully!',
                        life: 3000
                    });
                    fetchAuctions();
                } catch (err) {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete auction.',
                        life: 5000
                    });
                    console.error(err);
                }
            }
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    size="small"
                    className="p-button-rounded p-button-outlined"
                    onClick={() => navigate(`/admin/auctions/edit/${rowData.id}`)}
                    tooltip="Edit"
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    icon="pi pi-trash"
                    size="small"
                    className="p-button-rounded p-button-outlined p-button-danger"
                    onClick={() => handleDelete(rowData)}
                    tooltip="Delete"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return rowData.category ? rowData.category.name : 'N/A';
    };

    if (loading) {
        return (
            <div className="auction-list">
                <Toast ref={toast} />
                <Card className="list-card">
                    <div className="list-header">
                        <Skeleton width="200px" height="2rem" className="mb-2" />
                        <Skeleton width="300px" height="1rem" className="mb-3" />
                        <Skeleton width="150px" height="2.5rem" />
                    </div>
                    <div className="list-content">
                        <Skeleton width="100%" height="300px" />
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="auction-list">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <Card className="list-card">
                <div className="list-header">
                    <h2>
                        Manage Auctions
                    </h2>
                    <p>Manage all system auctions</p>
                    
                    <Button
                        label="New Auction"
                        icon="pi pi-plus"
                        className="p-button-success mb-3"
                        onClick={() => navigate('/admin/auctions/new')}
                    />
                </div>
                
                <div className="list-content">
                    {auctions.length === 0 ? (
                        <div className="empty-state">
                            <i className="pi pi-shopping-cart" style={{ fontSize: '3rem', color: '#6a6a6a' }} />
                            <h3>No auctions found</h3>
                            <p>Click "New Auction" to create the first auction.</p>
                        </div>
                    ) : (
                        <DataTable
                            value={auctions}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="p-datatable-sm"
                            responsiveLayout="scroll"
                            emptyMessage="No auctions found."
                        >
                            <Column 
                                field="title" 
                                header="Title" 
                                sortable 
                                style={{ minWidth: '200px' }}
                            />
                            <Column 
                                field="description" 
                                header="Description" 
                                style={{ minWidth: '250px' }}
                                body={(rowData) => (
                                    <div className="description-cell">
                                        {rowData.description?.length > 100 
                                            ? `${rowData.description.substring(0, 100)}...` 
                                            : rowData.description
                                        }
                                    </div>
                                )}
                            />
                            <Column 
                                header="Category" 
                                body={categoryBodyTemplate}
                                sortable 
                                style={{ minWidth: '120px' }}
                            />
                            <Column 
                                header="Actions" 
                                body={actionBodyTemplate}
                                style={{ minWidth: '120px', textAlign: 'center' }}
                            />
                        </DataTable>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AuctionList;