from sql_connection import get_sql_connection

def get_all_products(connection):
    cursor = connection.cursor()
    query = ("""SELECT products.products_id, products.name, products.uom_id, products.price_per_unit, uom.uom_name 
                 FROM products INNER JOIN uom ON products.uom_id = uom.uom_id;""")
    cursor.execute(query)
    response = []
    for (products_id, name, uom_id, price_per_unit, uom_name) in cursor:
        response.append({
            'products_id': products_id,
            'name': name,
            'uom_id': uom_id,
            'price_per_unit': price_per_unit,
            'uom_name': uom_name
        })
    cursor.close()
    return response

def insert_new_product(connection, product):
    cursor = connection.cursor()
    query = ("INSERT INTO products "
             "(name, uom_id, price_per_unit) "
             "VALUES (%s, %s, %s)")
    data = (product['product_name'], product['uom_id'], product['price_per_unit'])

    try:
        cursor.execute(query, data)
        connection.commit()
        return cursor.lastrowid
    except Exception as e:
        connection.rollback()
        print(f"Error inserting product: {e}")
        return None
    finally:
        cursor.close()

def delete_product(connection, product_id):
    cursor = connection.cursor()
    query = "DELETE FROM products WHERE product_id = %s"
    
    try:
        cursor.execute(query, (product_id,))
        connection.commit()
        return cursor.rowcount > 0  # Returns True if deletion was successful
    except Exception as e:
        connection.rollback()
        print(f"Error deleting product: {e}")
        return False
    finally:
        cursor.close()

if __name__ == '__main__':
    connection = get_sql_connection()
    # print(get_all_products(connection))
    print(insert_new_product(connection, {
        'product_name': 'potatoes',
        'uom_id': '1',
        'price_per_unit': 10
    }))
