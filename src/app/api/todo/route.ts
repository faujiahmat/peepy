import { NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { Prisma } from '@prisma/client';
import { AuthenticatedRequest, authMiddleware } from '@/middleware/auth';
import { createTodoValidation } from '@/utils/validation';

export async function GET(req: AuthenticatedRequest) {
  try {
    const auth = authMiddleware(req);
    if (auth instanceof NextResponse) return auth;

    const userId = req.user?.id;
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search')?.trim() || '';
    const limit = 5;
    const skip = (page - 1) * limit;

    const whereCondition = {
      userId,
      OR: search
        ? [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ]
        : undefined,
    };

    const [todos, totalTodos] = await Promise.all([
      prisma.todo.findMany({
        skip,
        take: limit,
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.todo.count({ where: whereCondition }),
    ]);

    const totalPages = Math.ceil(totalTodos / limit);

    return NextResponse.json(
      {
        statusCode: 200,
        success: true,
        message:
          todos.length === 0 ? 'No todos found' : 'Todos fetched successfully',
        data: {
          todos,
          pagination: {
            total: totalTodos,
            page,
            limit,
            totalPages,
          },
        },
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: 'Error at /api/todo GET: ' + (error as Error).message,
        data: null,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: AuthenticatedRequest) {
  try {
    const auth = authMiddleware(req);
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();

    const { error, value } = createTodoValidation(body);

    if (error != null) {
      return NextResponse.json(
        {
          statusCode: 400,
          success: false,
          message: error.details[0].message,
          data: value,
          error: 'Bad Request',
        },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        ...value,
        userId: req.user?.id || '',
      },
    });

    return NextResponse.json(
      {
        statusCode: 201,
        success: true,
        message: 'Todo created successfully',
        data: todo,
        error: null,
      },
      { status: 201 }
    );
  } catch (error: Error | unknown) {
    return NextResponse.json(
      {
        statusCode: 500,
        success: false,
        message: 'Error at /api/todo POST: ' + (error as Error).message,
        data: null,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
