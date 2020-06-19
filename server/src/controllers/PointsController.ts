import {Request, Response} from 'express';
import knex from '../database/connection';
import { KnexTimeoutError } from 'knex';

class PointsController {

    async index(request: Request, response: Response){
        

        const { city, uf, items } = request.query;
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        
        // SELECT DISTINCT * FROM points
        // JOIN point_items ON points.id=point_items.point_id
        // WHERE point_items.item_id in (1,2) and city='Brasília'	and uf='DF'
        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems) // whereIn: point_items.item_id tem que estar dentro de parsedItems
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct() // retira duplicatas 
            .select('points.*');

        return response.json(points);
    }

    async show(request: Request, response: Response){
        const { id } = request.params;
        
        const point = await knex('points').where('id', id).first();

        if(!point) {
            return response.status(400).json({message: 'Point not found.'});
        }


        /**
         * SELECT * FROM items
         *      JOIN point_items ON items.id = point_items.item_id
         *      WHERE point_items.point_id = (id)
         */
        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id);
        const items_title = items.map(item => ({title:item.title}) );

        return response.json({point, items:items_title});
    }

    async create(request: Request, response: Response){
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items    
        } = request.body;

        const point = {
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }


    //      SOLUÇÃO DO DIEGO
    //     const trx = await knex.transaction();
    //     const insertedPoints = await trx('points').insert(point);

    //     const point_id = insertedPoints[0];

    //     const pointItems = items.map((item_id: number) => {
    //         return {
    //             item_id,
    //             point_id,
    //         }
    //     })
        
    //     await trx('point_items').insert(pointItems);

    //     await trx.commit();

    //     return response.json({
    //         id: point_id,
    //         ...point,
    //     });


        // CONSERTAR VALIDAÇÃO DE CONSTRAINT FK

        const all_items = await knex('items').select('id');
        const all_items_ids = all_items.map(item => item.id);
        var ids = await knex('points').insert(point);
        try{
        var pointItems = items.map((item: number) => {
            if (!all_items_ids.includes(item)){
                throw "Item not found";    
            }
            return {
                item_id:item,
                point_id:ids[0]
            } 
        })
        await knex('point_items').insert(pointItems);
        } catch(err){
            console.log(err);
            return response.status(404).json({message:"Item not found."});
        }
        return response.status(200).json(pointItems);
    }
}


export default PointsController;

// TO DO:
//      - Arrumar knex.transaction;
//      - Flexibilizar filtros do listar points;
//      - Update e delete points;
