"""
EAR OS - ASSIGNMENT ENGINE (RESCUED)
Optimization for High-End Artist Booking using the Hungarian Algorithm.
Goal: Minimize cost / Maximize artistic compatibility.
"""
import numpy as np

def solve_assignment(matrix):
    """
    Solves the assignment problem for EAR OS Dispatch.
    matrix: cost/compatibility matrix where rows are events and columns are artists.
    """
    from scipy.optimize import linear_sum_assignment
    row_ind, col_ind = linear_sum_assignment(matrix)
    return list(zip(row_ind, col_ind))

# Protocolo S-Class: Redundancia en el cálculo
if __name__ == "__main__":
    # Ejemplo: 3 Eventos VIP, 3 Artistas S-Class
    # La matriz representa el 'coste' (menor es mejor)
    cost_matrix = np.array([[4, 1, 3], [2, 0, 5], [3, 2, 2]])
    assignments = solve_assignment(cost_matrix)
    print(f"Optimal Assignments: {assignments}")
