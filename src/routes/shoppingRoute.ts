import { exec, query } from "../db";
import type { FastifyInstance } from "fastify";

export type User = {
  id: number;
  username: string;
};

export async function shoppingRoutes(fastify: FastifyInstance) {
  fastify.get("/get_shopping_list", async (req, reply) => {
    const { rows: rowsList } = await query(
      fastify,
      "shopping.get_shopping_list"
    );
    const { rows: storeList } = await query(fastify, "shopping.get_stores");

    const newRows = rowsList.map((row) => {
      return {
        id: row.id,
        name: row.name,
        store: {
          id: row.store_id,
          name: storeList.filter((r) => r.id == row.store_id)[0].name,
        },
      };
    });

    return reply.send({
      items: newRows,
      stores: storeList,
    });
  });

  fastify.post<{ Body: { itemName: string; storeName: string } }>(
    "/add_item",
    async (req, reply) => {
      const { rows } = await exec<{ itemName: string; storeName: string }>(
        fastify,
        "shopping.add_item_to_list",
        req.body.itemName,
        req.body.storeName
      );
      return reply.send({ message: "Item added to list successfully!" });
    }
  );

  fastify.delete<{ Params: { itemID: number } }>(
    "/remove_item/:itemID",
    async (req, reply) => {
      const { rows } = await exec(
        fastify,
        "shopping.remove_item_from_list",
        req.params.itemID
      );
      return reply.send({ message: "Item removed from list successfully!" });
    }
  );

  fastify.put<{
    Body: { itemID: number; newItemName: string; newStoreName: string };
  }>("/update_item", async (req, reply) => {
    const { rows } = await exec(
      fastify,
      "shopping.update_item",
      req.body.itemID,
      req.body.newItemName,
      req.body.newStoreName
    );
    return reply.send({ message: "Item updated successfully!" });
  });
}
