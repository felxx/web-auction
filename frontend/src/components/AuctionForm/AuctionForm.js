import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import auctionService from '../../services/auctionService';
import categoryService from '../../services/categoryService';
import './AuctionForm.css';

/**
 * Componente reutilizável de formulário de leilão
 * @param {Object} props
 * @param {string} props.returnPath - Caminho para retornar após salvar (ex: '/admin/auctions' ou '/my-auctions')
 */
const AuctionForm = ({ returnPath = '/admin/auctions' }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryId: null,
        startDateTime: null,
        endDateTime: null,
        minimumBid: 0.01
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories();
                setCategories(response.data.content);
            } catch (err) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao carregar categorias.',
                    life: 5000
                });
                console.error(err);
            }
        };
        fetchCategories();

        if (id) {
            fetchAuction();
        }
    }, [id]);

    const fetchAuction = async () => {
        setInitialLoading(true);
        try {
            const response = await auctionService.getAuction(id);
            setFormData({
                title: response.data.title || '',
                description: response.data.description || '',
                categoryId: response.data.categoryId || null,
                startDateTime: response.data.startDateTime ? new Date(response.data.startDateTime) : null,
                endDateTime: response.data.endDateTime ? new Date(response.data.endDateTime) : null,
                minimumBid: response.data.minimumBid || 0.01
            });
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao carregar leilão.',
                life: 5000
            });
            console.error(err);
        } finally {
            setInitialLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Helper function to convert local date to ISO string without timezone conversion
        const toLocalISOString = (date) => {
            if (!date) return null;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };
        
        const auction = { 
            title: formData.title, 
            description: formData.description, 
            categoryId: formData.categoryId,
            startDateTime: toLocalISOString(formData.startDateTime),
            endDateTime: toLocalISOString(formData.endDateTime),
            minimumBid: formData.minimumBid
        };
        
        try {
            if (id) {
                await auctionService.updateAuction(id, auction);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Leilão atualizado com sucesso!',
                    life: 3000
                });
            } else {
                await auctionService.createAuction(auction);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Leilão criado com sucesso!',
                    life: 3000
                });
            }
            setTimeout(() => navigate(returnPath), 1500);
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao salvar leilão.',
                life: 5000
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="auction-form">
                <Toast ref={toast} />
                <Card className="form-card">
                    <div className="form-header">
                        <Skeleton width="200px" height="2rem" className="mb-2" />
                        <Skeleton width="300px" height="1rem" />
                    </div>
                    <div className="auction-form-content">
                        <div className="field">
                            <Skeleton width="100px" height="1rem" className="mb-2" />
                            <Skeleton width="100%" height="3rem" />
                        </div>
                        <div className="field">
                            <Skeleton width="100px" height="1rem" className="mb-2" />
                            <Skeleton width="100%" height="5rem" />
                        </div>
                        <div className="field">
                            <Skeleton width="100px" height="1rem" className="mb-2" />
                            <Skeleton width="100%" height="3rem" />
                        </div>
                        <div className="form-actions">
                            <Skeleton width="100px" height="2.5rem" />
                            <Skeleton width="100px" height="2.5rem" />
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="auction-form">
            <Toast ref={toast} />
            <Card className="form-card">
                <div className="form-header">
                    <h2>
                        {isEdit ? 'Editar Leilão' : 'Novo Leilão'}
                    </h2>
                    <p>Preencha os detalhes do leilão abaixo</p>
                </div>
                
                <form onSubmit={handleSubmit} className="auction-form-content">
                    <div className="field">
                        <label htmlFor="title" className="field-label">
                            <i className="pi pi-tag mr-2" />
                            Título *
                        </label>
                        <InputText
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Digite o título do leilão"
                            className="w-full"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="description" className="field-label">
                            <i className="pi pi-align-left mr-2" />
                            Descrição *
                        </label>
                        <InputTextarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Digite a descrição do leilão"
                            className="w-full"
                            rows={4}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="category" className="field-label">
                            <i className="pi pi-tags mr-2" />
                            Categoria *
                        </label>
                        <Dropdown
                            id="category"
                            value={formData.categoryId}
                            onChange={(e) => handleInputChange('categoryId', e.value)}
                            options={categories}
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Selecione uma categoria"
                            className="w-full"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="minimumBid" className="field-label">
                            <i className="pi pi-money-bill mr-2" />
                            Lance Mínimo *
                        </label>
                        <InputNumber
                            id="minimumBid"
                            value={formData.minimumBid}
                            onValueChange={(e) => handleInputChange('minimumBid', e.value)}
                            mode="currency"
                            currency="BRL"
                            locale="pt-BR"
                            placeholder="Digite o lance mínimo"
                            className="w-full"
                            min={0.01}
                            minFractionDigits={2}
                            maxFractionDigits={2}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="startDateTime" className="field-label">
                            <i className="pi pi-calendar mr-2" />
                            Data e Hora de Início *
                        </label>
                        <Calendar
                            id="startDateTime"
                            value={formData.startDateTime}
                            onChange={(e) => handleInputChange('startDateTime', e.value)}
                            showTime
                            hourFormat="24"
                            placeholder="Selecione a data e hora de início"
                            className="w-full"
                            required
                            disabled={loading}
                            minDate={new Date()}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="endDateTime" className="field-label">
                            <i className="pi pi-calendar mr-2" />
                            Data e Hora de Término *
                        </label>
                        <Calendar
                            id="endDateTime"
                            value={formData.endDateTime}
                            onChange={(e) => handleInputChange('endDateTime', e.value)}
                            showTime
                            hourFormat="24"
                            placeholder="Selecione a data e hora de término"
                            className="w-full"
                            required
                            disabled={loading}
                            minDate={formData.startDateTime || new Date()}
                        />
                    </div>

                    <div className="form-actions">
                        <Button
                            type="button"
                            label="Cancelar"
                            icon="pi pi-times"
                            className="p-button-outlined"
                            onClick={() => navigate(returnPath)}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            label={isEdit ? 'Atualizar' : 'Criar'}
                            icon={isEdit ? 'pi pi-check' : 'pi pi-plus'}
                            className="p-button-success"
                            loading={loading}
                            disabled={loading}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AuctionForm;
