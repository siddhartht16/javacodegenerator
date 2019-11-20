<% if (classObject) { %>

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins="*", allowedHeaders = "*", allowCredentials = "true")
public class <%= classObject.serviceName %> {

	@Autowired
	<%= classObject.repositoryName %> <%= classObject.repositoryVariable %>;

	@GetMapping("/api/<%= classObject.classPluralName %>")
	public List<<%= classObject.name %>> findAll<%= classObject.name %>s() {
		return (List<<%= classObject.name %>>) <%= classObject.repositoryVariable %>.findAll();
	}

	@PostMapping("/api/<%= classObject.classPluralName %>")
	public List<<%= classObject.name %>> create<%= classObject.name %>(@RequestBody <%= classObject.name %> new<%= classObject.name %>) {

		new<%= classObject.name %> = <%= classObject.repositoryVariable %>.save(new<%= classObject.name %>);
		return (List<<%= classObject.name %>>) <%= classObject.repositoryVariable %>.findAll();
	}

	@GetMapping("/api/<%= classObject.classSingularName %>/{<%= classObject.classSingularName %>Id}")
	public <%= classObject.name %> find<%= classObject.name %>ById(@PathVariable("<%= classObject.classSingularName %>Id") int <%= classObject.classSingularName %>Id) {
		return <%= classObject.repositoryVariable %>.findById(<%= classObject.classSingularName %>Id).get();
	}

	@PutMapping("/api/<%= classObject.classSingularName %>/{<%= classObject.classSingularName %>Id}")
	public <%= classObject.name %> update<%= classObject.name %>(@PathVariable("<%= classObject.classSingularName %>Id") int <%= classObject.classSingularName %>Id, @RequestBody <%= classObject.name %> new<%= classObject.name %>) {

		<%= classObject.name %> <%= classObject.classSingularName %>ToUpdate = <%= classObject.repositoryVariable %>.findById(<%= classObject.classSingularName %>Id).get();
		<%= classObject.classSingularName %>ToUpdate = <%= classObject.repositoryVariable %>.save(<%= classObject.classSingularName %>ToUpdate);
		return <%= classObject.repositoryVariable %>.findById(<%= classObject.classSingularName %>Id).get();
	}

	@DeleteMapping("/api/<%= classObject.classSingularName %>/{<%= classObject.classSingularName %>Id}")
	public List<<%= classObject.name %>> delete<%= classObject.name %>(@PathVariable("<%= classObject.classSingularName %>Id") int <%= classObject.classSingularName %>Id) {

		<%= classObject.repositoryVariable %>.deleteById(<%= classObject.classSingularName %>Id);
		return (List<<%= classObject.name %>>) <%= classObject.repositoryVariable %>.findAll();
	}
}

            <% } %>

