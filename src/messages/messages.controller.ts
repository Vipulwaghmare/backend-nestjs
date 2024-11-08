import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-messages.dto';

// Controller is class decorator as we use it for entire class
// GET, POST are method decorators as we use it for each method
// BODY, PARAM, QUERY are argument decorators as we use it for each argument

@Controller('/api/v1/message')
export class MessagesController {
  @Get()
  listMessages() {
    const x = 'test'
    return x
  }

  // Data transfer object
  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    return body
  }

  @Get(':id')
  getMessage(@Param('id') id: string) {
    return id
  }
}
