import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import slugify from "slugify";

export class AddSlugToProducts1792195203000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("products", new TableColumn({
            name: "slug",
            type: "varchar",
            isUnique: true,
            isNullable: true,
        }));

        // Os produtos desta base já existem; preencher o slug antes de torná-lo obrigatório.
        const products: { id: number; name: string }[] = await queryRunner.query("SELECT id, name FROM products");
        for (const product of products) {
            const slug = slugify(product.name, { lower: true, strict: true });
            await queryRunner.query("UPDATE products SET slug = ? WHERE id = ?", [slug, product.id]);
        }

        await queryRunner.query("ALTER TABLE products MODIFY COLUMN slug varchar(255) NOT NULL AFTER name");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("products", "slug");
    }
}
