def paginate(items: list, page: int = 1, page_size: int = 20) -> dict:
    """Simple in-memory pagination helper."""
    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": items[start:end],
    }
